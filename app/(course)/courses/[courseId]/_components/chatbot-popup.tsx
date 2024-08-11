"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { MutableRefObject, Ref, RefObject, useRef } from "react";
import { ChatWidgetTabs } from "./chat-tabs";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import {onToggle} from "@/lib/trigger"

interface ChatWidgetProps {
  children: React.ReactNode;
}

export function ChatWidget({ children }: ChatWidgetProps) {
  const pathname = usePathname();
  
  const trigger = useSelector((state: RootState) => state.trigger.value);
  const dispatch = useDispatch();
  return (
    <div>
      {
        ((!pathname.includes("exam") &&  !pathname.includes("quiz")) || pathname.includes("teacher")) && 
          (<Popover open={trigger}>
            <PopoverTrigger onClick={() => dispatch(onToggle())} asChild>{children}</PopoverTrigger>
            <PopoverContent  className="w-fit rounded-xl ml-5 p-0">
              <ChatWidgetTabs />
            </PopoverContent>
          </Popover>)
  
      }

    </div>
  );
}
