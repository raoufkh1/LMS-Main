import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import UserProfile from './_components/UserProfile';

export const page = ({children, params}:{
    children: React.ReactNode,
    params: {studentId: string}
}) => {
    const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <div className=''><UserProfile params={params}/></div>
  )
}
