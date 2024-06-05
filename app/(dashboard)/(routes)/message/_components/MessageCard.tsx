import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs'
import React from 'react'
interface Props {
    firstName : string
    lastName: string
    context: string
}
const MessageCard = ({firstName, lastName,context}:Props) => {
    
      
    
    
    return (

            <a href="#" className="mt-4 block w-5xl w-[800px] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            <h5 className="mb-2 text-[10px] font-light tracking-tight text-gray-900 dark:text-white">{`${firstName} ${lastName}`}</h5>
                            <p className=" text-gray-700 font-semibold dark:text-gray-400  text-center">{context}</p>
            </a>


    )
}

export default MessageCard