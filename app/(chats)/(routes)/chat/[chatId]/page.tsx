import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import ChatClient from "./components/ChatClient";

interface chatIdParams {
  params: {
    chatId: string;
  };
}
const ChatIdPage = async ({ params }: chatIdParams) => {
  const { userId } = auth();
  if (!userId) {
    return auth().redirectToSignIn();
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId,
        },
      },
      _count:{
        select: {
          messages: true
        }
      }
    },
  });

    if (!companion) {
        return redirect("/");
    }
  return <ChatClient companion={companion} />;
};

export default ChatIdPage;
