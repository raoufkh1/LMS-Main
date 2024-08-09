"use client"
import { getAuth } from '@clerk/nextjs/server';
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const MessageInput = ({setMessages,messageId} : {setMessages: Function,messageId:string}) => {
    
    const [context, setContext] = useState("")
    const onSubmit = async (e:any) => {
        e.preventDefault()
        if(messageId){
          ("reply")
          try {
            const {data} = await axios.post("/api/messages/reply", {context: context,messageId});
            
            toast.success("تم إرسال الرد");
            setContext("")
          } catch (e){
            (e)
            toast.error("هناك شئ غير صحيح");
          }
        }
        else{
          try {
            const {data} = await axios.post("/api/messages", {context: context});
            
            toast.success("تم إرسال الرسالة");
            setContext("")
          } catch (e){
            (e)
            toast.error("هناك شئ غير صحيح");
          }

        }
      }
  return (
    
<form onSubmit={e => {onSubmit(e)}}>   
    <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">شارك رسالة</label>
    <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            
        </div>
        <input type="text"  onChange={e => setContext(e.target.value)} value={context} id="search" dir='rtl' className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none" placeholder="اكتب رسالة" required />
        <button type="submit" className="text-white absolute start-2.5 bottom-2.5 bg-sky-700 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-sky-700 dark:hover:bg-sky-600 dark:focus:ring-blue-800">ارسال</button>
    </div>
</form>

  )
}

export default MessageInput