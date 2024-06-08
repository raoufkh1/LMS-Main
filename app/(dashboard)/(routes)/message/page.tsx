"use client"
import React, { useEffect, useState } from 'react'
import MessageInput from './_components/MessageInput'
import MessageCard from './_components/MessageCard'
import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs'
import { getMessages } from '@/actions/get-messages'
import axios from 'axios'

const Message = () => {
  const [messages, setMessages] = useState<{ msg: { id: string; userId: string | null; context: string; messageId: string | null; createdAt: Date; updatedAt: Date }; user: { firstName: string | null; lastName: string | null } }[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const {data} = await axios.get("/api/messages")
        setMessages(data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);


  return (
    <div>
    <div className='px-6 pt-6 block'>
        <MessageInput setMessages={setMessages}/>
    </div>
    <div className='mt-24 flex justify-center'>
      <div>
      {
                  messages.map(({msg, user}, index) => {
                      return (
                        
                        <MessageCard key={index} context={msg.context} firstName={user.firstName || ""} lastName={user.lastName || ""}/>
                      )
                  })
              }

      </div>
    </div>
    </div>
  )
}

export default Message