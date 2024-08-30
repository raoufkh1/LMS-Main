"use client"
import React, { useEffect, useState } from 'react'

import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'
import { getMessages } from '@/actions/get-messages'
import axios from 'axios'
import { pusherClient } from '@/lib/pusher'
import { User } from '@clerk/nextjs/server'
import ReplyCard from './_components/ReplyCard'
import ReplyCardOwner from './_components/ReplyCardOwner'
import { Message } from '@prisma/client'
import ReplyInput from './_components/ReplyInput'
interface Props {
  msg: { context: string, createdAt: string, id: string,repliesCount:number },
  user: { imageUrl: string, lastName: string, firstName: string, id: string }
}
const Reply = ({ params }: { params: { messageId: string } }) => {
  const [replies, setReplies] = useState<Props[]>([])
  const [origin, setOrigin] = useState<any>()
  useEffect(() => {

    console.log("ss")
    pusherClient.subscribe("chat-event")



    pusherClient.bind("update-reply", async (e: any) => {
      try {
        console.log("new msg")
        let { tempMsg } = e
        setReplies((prevState: Props[]) => [tempMsg, ...prevState])
      } catch (error) {
        console.log(error)
      }

    })
    pusherClient.bind("delete-reply", (e: any) => {
      console.log("delete msg")
      let { messageId } = e
      
      setReplies((prevState: Props[]) => [...prevState.filter(e => e.msg.id != messageId)])

    })
    setTimeout(() => {

      return () => {
        pusherClient.unsubscribe("chat-event");
      };
    }, 1000);
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${params.messageId}`)
        console.log(data)
        setReplies(data.replies)
        setOrigin(data.orgin)
        console.log(replies)
      } catch (error) {
        console.log(error)
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    console.log(origin)
  }, [origin])
  return (
    <div className='relative w-full'>
      <div className='px-6 pt-6 block'>
        <ReplyInput messageId={params.messageId} />

      </div>
      <div className='mt-6 flex justify-center'>
        {
          origin && (<ReplyCardOwner user={origin?.user} msg={origin?.message} />)
        }

      </div>
      <hr className='bg-gray-600 text-black h-[2px]' />
      <div className='mt-6 flex justify-center'>
        <div>
          {

            replies.map((reply: any, index) => {
              console.log("s")
              return (
                reply && <ReplyCard messageId={params.messageId} msg={reply.msg} user={reply.user} />
              )
            })
          }

        </div>
      </div>
    </div>
  )
}

export default Reply