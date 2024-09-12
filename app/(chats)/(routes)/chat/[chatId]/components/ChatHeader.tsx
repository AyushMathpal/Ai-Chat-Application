import React from "react";
import { ChatClientProps } from "./ChatClient";
import { Button } from "@/components/ui/button";
import {
  Bot,
  ChevronLeft,
  Edit,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import { BotAvatar } from "@/components/ui/chat-avatar";
import { Companion, Message } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const ChatHeader = ({ companion }: ChatClientProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();

  const onDelete = async () => {
    try {
      await axios.delete(`/api/companion/${companion.id}`);
      toast({
        description: "Success.",
      });
        router.refresh()
        router.push("/");
    } catch (error) {
      toast({
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  }; 
  return (
    <div
      className="flex w-full justify-between items-center
  border-b border-primary/10 pb-4"
    >
      <div className="flex gap-x-2 items-center">
        <Button size="icon" variant="ghost" onClick={()=>router.back()}>
          <ChevronLeft className="size-8" />
        </Button>
        <BotAvatar src={companion.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{companion.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <MessagesSquare className="size-3 mr-1" />
              {companion._count.messages}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Created by {companion.userName}
          </p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/companion/${companion.id}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
