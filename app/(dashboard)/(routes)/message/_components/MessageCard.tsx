import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs'
import React from 'react'

const MessageCard = async () => {
    let messagesWithUser: { msg: { id: string; userId: string | null; context: string; messageId: string | null; createdAt: Date; updatedAt: Date }; user: { firstName: string | null; lastName: string | null } }[] = []
    const messages = await db.message.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
    await Promise.all(

        messages.map(async (msg) => {
            if (msg.userId != "nil") {
    
                const response = await clerkClient.users.getUser(msg!.userId)
                let tempMsg = { msg, user: { firstName: response.firstName, lastName: response.lastName } }
                messagesWithUser.push(tempMsg)
            }
        })
    )
    return (
        <div>
            {
                messagesWithUser.map((msg, index) => {
                    return (
                        <a key={index} href="#" className="mt-4 block w-5xl w-[800px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 className="mb-2 text-[10px] font-light tracking-tight text-gray-900 dark:text-white">{`${msg.user.firstName} ${msg.user.lastName}`}</h5>
                            <p className=" text-gray-700 font-semibold dark:text-gray-400  text-center">{msg.msg.context}</p>
                        </a>
                    )
                })
            }

        </div>
    )
}

export default MessageCard