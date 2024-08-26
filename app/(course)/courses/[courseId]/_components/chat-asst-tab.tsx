"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BotIcon, DotIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaSpinner } from "react-icons/fa";
import OpenAI from "openai";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { Assistant } from "openai/resources/beta/assistants.mjs";

interface Message {
  text: string;
  isUserMessage: boolean;
}

const ChatAsstTab = () => {
    
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage on initial render
    const storedMessages = localStorage.getItem("assistantMessages2");
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [assistant,setAssistant] = useState<Assistant>()
  const [thread,setThread] = useState<Thread>()
  const [openai,setOpenAi] = useState<OpenAI>()
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // حفظ messages to localStorage whenever messages change
    localStorage.setItem("assistantMessages2", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      await handleSubmitMessage(inputValue);
      setInputValue("");
    }
  };

  const handleSubmitMessage = async (message: string) => {
    // Add the user message to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUserMessage: true },
      // Add an empty message for the loading dot
      { text: "", isUserMessage: false },
    ]);

    try {
      // Construct queryMessages from the last 10 messages
      const queryMessages = messages
        .slice(-10) // Take the last 10 messages
        .map((msg) => ({
          role: msg.isUserMessage ? "user" : "user",
          parts: [{ "text": msg.text }],
        }));

      // Add the current user message to queryMessages
      queryMessages.push({ role: "user", parts: [{ "text": message }] });

      // Fetch response from ChatGPT
      await openai?.beta.threads.messages.create(thread?.id!, {
        role: "user",
        content: message,
      });
  
      // Run the assistant
      const run = await openai?.beta.threads.runs.create(thread?.id!, {
        assistant_id: assistant!.id,
      });
  
      // Create a response
      let response = await openai?.beta.threads.runs.retrieve(thread?.id!, run!.id);
      while (response?.status === "in_progress" || response?.status === "queued") {
        console.log("waiting...");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        response = await openai?.beta.threads.runs.retrieve(thread?.id!, run?.id!);
      }
      const messageList:any = await openai?.beta.threads.messages.list(thread!.id);
      console.log(messageList?.data[0].content[0]?.text?.value)
      // Extract the ChatGPT response
      const chatGPTResponse: string = ""

      // Update messages array with ChatGPT response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1), // Remove the empty message
        {
          text: messageList?.data[0].content[0]?.text?.value,
          isUserMessage: false,
        },
      ]);
    } catch (error) {
      console.error(":حدث خطأ أثناء جلب استجابة ChatGPT", error);
    }
  };
  useEffect(() => {
    instChatBot()
},[])
    const instChatBot = async () => {
        const openai = new OpenAI({
            apiKey: process.env.NEXT_PUBLIC_CHATGPY_API_KEY,
            dangerouslyAllowBrowser: true
        });
        const assistant = await openai.beta.assistants.create({
            name: "Hockey Expert",
            instructions: "You are a graphic design expert. You specialize in helping others learn about graphic design.",
            tools: [{ type: "code_interpreter" }],
            model: "gpt-4-1106-preview",
        });
    
        // Create a thread
        const thread = await openai.beta.threads.create();
        setAssistant(assistant)
        setThread(thread)
        setOpenAi(openai)
    }
  return (
    <Card className="shadow-none border-none p-0">
      <CardContent className="space-y-2 mt-3.5 pt-9 h-[300px] max-h-[300px] overflow-y-auto">
        <div className="space-y-4" dir="rtl">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex text-white text-sm ${msg.isUserMessage ? "justify-start" : "justify-end"
                }`}
            >
              {msg.isUserMessage ? (
                <div className="bg-emerald-500 rounded-xl rounded-br-none w-fit max-w-xs px-3 py-2">
                  {msg.text}
                </div>
              ) : (
                <div className="bg-sky-500 rounded-xl rounded-bl-none w-fit max-w-xs px-3 py-2 whitespace-pre-wrap">
                  {msg.text === "" ? (
                    <FaSpinner className="text-lg animate-spin" />
                  ) : (
                    msg.text
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter>
        <Input
          type="text"
          className="w-full border-none focus-visible:ring-0 bg-slate-100 mt-5"
          placeholder="...اكتب رسالتك"
          value={inputValue}
          multiple
          onChange={handleInputChange}
          dir="rtl"
          onKeyDown={handleKeyPress}
        />
      </CardFooter>
    </Card>
  );
};

export default ChatAsstTab;
