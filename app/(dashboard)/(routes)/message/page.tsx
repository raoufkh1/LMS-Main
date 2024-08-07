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
  msg: { context: string, createdAt: string, id: string,repliesCount:number },
  user: { imageUrl: string, lastName: string, firstName: string, id: string }
}
const Message = () => {
  const [messages, setMessages] = useState<Props[]>([])
  const [doubleMessage, setDoubleMessages] = useState<Props[]>([])
  const [replyIs, setReplyIs] = useState<string>('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/messages")
        setMessages(data)
        setDoubleMessages(data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    
    console.log("ss")
    pusherClient.subscribe("chat-event")
    pusherClient.bind("update-message", (e: any) => {
      console.log(messages)
      console.log("new msg")
      let { tempMsg } = e
      setMessages((prevState: Props[]) => [tempMsg, ...prevState])
    })
    pusherClient.bind("delete-message", (e: any) => {
      console.log("delete msg")
      let { messageId } = e
      const tempMsg = messages
      setMessages((prevState: Props[]) => [...prevState.filter(e => e.msg.id != messageId)])

    })
    
    pusherClient.bind("update-reply", async(e: any) => {
      try {
        const { data } = await axios.get("/api/messages")
        setMessages(data)
        setDoubleMessages(data)
      } catch (error) {
        console.log(error)
      }

    })
    setTimeout(() => {

      return () => {
        pusherClient.unsubscribe("chat-event");
      };
    }, 1000);
  }, [])
  useEffect(() => {
    console.log(doubleMessage)
  }, [doubleMessage])
  return (
    <div>
      <div className='px-6 pt-6 block'>
        {
          replyIs ? (
            <div>
              <a onClick={async e => {
                const element = document.getElementById(replyIs);
                 element?.scrollIntoView({
                  behavior: 'instant'
                  
                });
                
                  
                  window.scrollBy({top:-250})
                
              }} className='text-sm text-gray-400 py-5 px-5' dir='rtl'>   تقوم حاليا بالرد على رسالة</a>

            </div>
          ) : ''
        }
        <MessageInput messageId={replyIs} setMessages={setMessages} />
      </div>
      <div className='mt-6 flex justify-center'>
        <div>
          {
            messages.map(({ msg, user }, index) => {
              return (

                <MessageCard replyIs={replyIs} setReplyIs={setReplyIs} key={index} msg={msg} user={user} />
              )
            })
          }

        </div>
      </div>
    </div>
  )
}

export default Message