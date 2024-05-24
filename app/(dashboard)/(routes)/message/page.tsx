import React from 'react'
import MessageInput from './_components/MessageInput'
import MessageCard from './_components/MessageCard'

const page = () => {
  return (
    <div>
    <div className='px-6 pt-6 block'>
        <MessageInput />
    </div>
    <div className='mt-24 flex justify-center'>
      <MessageCard/>
    </div>
    </div>
  )
}

export default page