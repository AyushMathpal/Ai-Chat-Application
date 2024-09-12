"use client";
import { Companion, Message } from "@prisma/client";
import React, { FormEvent, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useRouter } from "next/navigation";
import { useCompletion } from "ai/react";
import { ChatForm } from "./ChatForm";
import { ChatMessages } from "./ChatMessages";
import { ChatMessageProps } from "./SingleMesssage";
export type ChatClientProps = {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
};
const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );
  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${companion.id}`,
      onResponse(response) {
        setInput("");
        router.refresh();
        console.log("Refreshed", response);
      },
      onFinish(prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };
        setMessages((current) => [...current, systemMessage]);
        setInput("");
        router.refresh();
        console.log("Refreshed", messages);
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };
    setMessages((current) => [...current, userMessage]);
    handleSubmit(e);
  };
  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        companion={companion}
      />
      <ChatForm
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatClient;
