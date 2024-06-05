"use client";
import { Companion } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "./SingleMesssage";
import { ElementRef, useEffect, useRef, useState } from "react";
interface ChatMessagesProps {
  messages: ChatMessageProps[];
  isLoading: boolean;
  companion: Companion;
}
export const ChatMessages = ({
  messages = [],
  isLoading,
  companion,
}: ChatMessagesProps) => {
    const scrollRef = useRef<ElementRef<"div">>(null);
  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
    useEffect(() => {
        if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto pr-4">
      <ChatMessage
        isLoading={fakeLoading}
        role="system"
        content={`Hello, I am ${companion.name}, ${companion.description} `}
        src={companion.src}
      />
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
          src={message.src}
        />
      ))}
      {isLoading && (<ChatMessage role="system" isLoading src={companion.src}/>)}
      <div ref={scrollRef} />
    </div>
  );
};
