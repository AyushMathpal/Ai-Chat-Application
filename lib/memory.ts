import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  // Creating a static singular instance of the class, so as to prevent reinitiation for every api call
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone();
  }

  
  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    const Pinecone = <Pinecone>this.vectorDBClient;
    const pineconeIndex = await Pinecone.Index(
      process.env.PINECONE_INDEX! || ""
    );
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY!,
      }),
      {
        pineconeIndex,
      }
    );
    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, {
        fileName: companionFileName,
      })
      .catch((err) => {
        console.log("Failed to search for similar documents", err);
      });
    return similarDocs;
  }

  // Creates singular instance of Memory Manager class
  public static async getInstance() : Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      MemoryManager.instance.vectorDBClient=new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    }
    return MemoryManager.instance;
  }

  // Acts as a unique key string for user and model for storing in Redis
  private generateRedisCompanionKey(companionKey: CompanionKey): string {
   
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  // Write into the redis history for context memory
  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }
    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
    return result;
  }

  // Fetch from redis history
  public async readLatestHistory(companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }
    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }
  /* Sets the initial configuration of the companion.
     The example conversation and behaviour are merged as inputs to this function.
     This kind of acts as a system prompt
   */
  public async seedChatHistory(
    seedContent: string,
    delimiter: string = "\n",
    companionKey: CompanionKey
  ) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("Chat history already exists");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, {
        score: counter,
        member: line,
      });
      counter += 1;
    }
  }
}
