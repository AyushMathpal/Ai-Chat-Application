import dotenv from "dotenv";
import { LangChainStream, StreamingTextResponse } from "ai";
import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";
import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { currentUser } from "@clerk/nextjs/server";

dotenv.config({ path: `.env` });

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await req.json();
    const user = await currentUser();
    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const identifier = req.url + "-" + user.id;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!companion) {
      return new NextResponse("Companion not found", { status: 404 });
    }

    const name = companion.id;
    const companion_file_name = name + ".txt";

    const companionKey = {
      companionName: name!,
      userId: user.id,
      modelName: "llama3-8b",
    };
    const memoryManager = await MemoryManager.getInstance();
    const records = await memoryManager.readLatestHistory(companionKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

    // This history comes from redis database as conversation context.
    const recentChatHistory = await memoryManager.readLatestHistory(
      companionKey
    );

    // This is the similarity search for relevant information
    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      companion_file_name
    );

    
    let relevantHistory = "";
    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    // Model provider
    const model = new Replicate({
      model:
        "meta/meta-llama-3-8b-instruct:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
      input: {
        max_length: 1024,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      
    });
    model.verbose = true;
    const resp = String(
      await model
        .call(
          `
          ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 
  
          ${companion.instructions}
  
          Below are relevant details about ${companion.name}'s past and the conversation you are in.
          ${relevantHistory}
          ${recentChatHistory}\n${companion.name}:`
        )
        .catch((error) => console.log("Error in model call."))
    );

    // Model response had lot of commas. Parsed to fix commas.
    const cleaned = resp.replaceAll(",", "");
    const chunks = cleaned.split("\n");
    const response = chunks[0];

    await memoryManager.writeToHistory("" + response.trim(), companionKey);
    var Readable = require("stream").Readable;


    // Streamable response in readable language
    let s = new Readable();
    s.push(response);
    s.push(null);
    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), companionKey);

      await prismadb.companion.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
