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

const Reply = ({params}: {params: {messageId:string}}) => {
  const [replies, setReplies] = useState([])
  const [origin, setOrigin] = useState<any>()
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
    },[origin])
  return (
    <div className='relative w-full'>
      <div className='mt-6 flex justify-center'>
        {
          origin && (<ReplyCardOwner user={origin?.user} msg={origin?.message} />)
        }
        
      </div>
      <hr className='bg-gray-600 text-black h-[2px]'/>
      <div className='mt-6 flex justify-center'>
        <div>
          {
            
            replies.map((reply:any,index) => {
              console.log("s")
                return (
                     reply &&  <ReplyCard msg={reply.msg} user={reply.user} />
                )
            })
          }

        </div>
      </div>
    </div>
  )
}

export default Reply