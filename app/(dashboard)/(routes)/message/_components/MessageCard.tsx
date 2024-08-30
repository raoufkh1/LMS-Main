"use client"
import { tConvert } from '@/lib/convertTime'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'
import { clerkClient } from '@clerk/nextjs/server'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
interface Props {
    msg: {context: string, createdAt: string,id:string,repliesCount:number},
    user:{imageUrl: string, lastName: string, firstName: string, id:string}
    setReplyIs: Function,
    replyIs: string
}
const MessageCard = ({replyIs,msg, user, setReplyIs}:Props) => {
   (msg)
   const {userId} = useAuth()
   const [isPopup, setIsPopup] = useState<Boolean>(false)
   const router = useRouter()
   const handleDelete = async () => {
      (msg.id)
      setIsPopup(false)
      try {
         const {data} = await axios.delete(`/api/messages/${msg.id}`);
         
         toast.success("تم حذف الرسالة");
       } catch (e){
         console.log(e)
         toast.error("هناك شئ غير صحيح");
       }
    }
    const handleClick = () => {
      router.push(`/message/${msg.id}`)
    }
    const today = new Date()
    const date = new Date(msg.createdAt)
    const isToday = today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear() ? true : false
    const dayString = isToday ? "" : `${date.getFullYear()}/${date.getMonth() + 1 }/${date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`}`
    const timePM = tConvert(`${date.getHours() > 10 ? date.getHours() : `0` + date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`}`)
    
    const dateString = `${dayString} ${isToday ? "" : "-"}  ${timePM}`
    return (

            
<div className={`relative flex items-start gap-2.5 w-full mb-4`} dir='rtl'>
   <img className="w-8 h-8 rounded-full" src={user.imageUrl} alt="Jese image"/>
   <div className={`  ${userId == user.id ? "bg-sky-700/50" : msg.id == replyIs ? "bg-gray-400" : ''} flex flex-col w-[650px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700`}>
      <div  id={msg.id} className="flex items-center space-x-2 rtl:space-x-reverse">
         <span className="text-sm font-semibold text-gray-900 dark:text-white">{`${user.firstName} ${user.lastName ? user.lastName : ""}`}</span>
         <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{dateString}</span>
      </div>
      <p className="text-base font-medium py-2.5 text-gray-900 dark:text-white">{msg?.context!}</p>
      <ul className='flex gap-[1px]'>
         <a onClick={handleClick} className='text-[11px] text-gray-600'>لديه {Math.floor(msg.repliesCount)} رد</a>
         
      </ul>
   </div>
   {
       (<button onClick={e => setIsPopup(!isPopup)} id="dropdownMenuIconButton" data-dropdown-toggle="dropdownDots" data-dropdown-placement="bottom-start" className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600" type="button">
         <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
         </svg>
      </button>)
   }
   
   {
      isPopup && (<div id="dropdownDots" className="absolute -left-40 z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600">
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
         {
            (userId == user.id || isTeacher(userId)) && 
            <li>
               <a onClick={handleDelete} href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">حذف</a>
            </li>
         }
         <li>
            <a href='#' onClick={handleClick} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">رد</a>
         </li>
      </ul>
   </div>)
   }
  
   
</div>



    )
}

export default MessageCard