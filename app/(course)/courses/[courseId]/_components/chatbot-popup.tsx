import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { ChatWidgetTabs } from "./chat-tabs";

interface ChatWidgetProps {
  children: React.ReactNode;
}

export function ChatWidget({ children }: ChatWidgetProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit rounded-xl ml-5 p-0">
        <ChatWidgetTabs />
      </PopoverContent>
    </Popover>
  );
}
