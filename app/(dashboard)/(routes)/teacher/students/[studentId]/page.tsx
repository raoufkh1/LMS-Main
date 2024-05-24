import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
import UserProfile from './_components/UserProfile';
interface PageProps {
  params: { studentId: string };
}
export const page = ({params}:PageProps) => {
    const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <div className=''><UserProfile params={params}/></div>
  )
}
