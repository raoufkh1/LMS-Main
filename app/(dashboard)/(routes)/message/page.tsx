"use client"
import React, { useEffect, useState } from 'react'
import MessageInput from './_components/MessageInput'
import MessageCard from './_components/MessageCard'
import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs'
import { getMessages } from '@/actions/get-messages'
import axios from 'axios'
import { pusherClient } from '@/lib/pusher'
interface Props {
  msg: {context: string, createdAt: string},
  user:{imageUrl: string, lastName: string, firstName: string}
}
const Message = () => {
  const [messages, setMessages] = useState<Props[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get("/api/messages")
        setMessages(data)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("ss")
    pusherClient.subscribe("chat-event")
    pusherClient.bind("update-message", (e: any) =>{
      console.log("new msg")
      let {tempMsg} = e
      setMessages((prevState:Props[]) => [tempMsg, ...prevState ])
    })
    setTimeout(() => {
      
      return () => {
        pusherClient.unsubscribe("chat-event");
      };
    }, 1000);
  }, [])
  return (
    <div>
    <div className='px-6 pt-6 block'>
        <MessageInput setMessages={setMessages}/>
    </div>
    <div className='mt-6 flex justify-center'>
      <div>
      {
                  messages.map(({msg, user}, index) => {
                      return (
                        
                        <MessageCard key={index} msg={msg} user={user}/>
                      )
                  })
              }

      </div>
    </div>
    </div>
  )
}

export default Message