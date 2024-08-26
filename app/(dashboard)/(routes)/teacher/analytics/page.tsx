import { clerkClient } from '@clerk/nextjs/server'
import React from 'react'
import UserCard from './_components/UserCard'


const page = async () => {
    
  return (
    <div className='mt-10 flex justify-center w-full px-10'><UserCard/></div>
  )
}

export default page