import { getCourses } from '@/actions/get-courses'
import { clerkClient } from '@clerk/nextjs'
import { Progress } from '@radix-ui/react-progress'
import React from 'react'
interface PageProps {
    params: { studentId: string };
  }
const UserProfile = async ({ params}:PageProps) => {
    console.log(params)
    const userInfo = await clerkClient.users.getUser(params?.studentId)
    const courserWithProgress = await getCourses({userId: params?.studentId})
    console.log(courserWithProgress)
  return (
    <div>
    <div className="flex w-full justify-center">
    
    <div className="max-w-xs">
        <div className="bg-white shadow-2xl rounded-lg py-3">
            <div className="photo-wrapper p-2">
                <img className="w-32 h-32 rounded-full mx-auto" src={userInfo.imageUrl} alt="John Doe"/>
            </div>
            <div className="p-2">
                <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{`${userInfo.firstName} ${userInfo.lastName}`}</h3>
                <div className="text-center text-gray-400 text-xs font-semibold">
                    <p>Last login:{`${(new Date(userInfo.updatedAt)).getDate()}/${(new Date(userInfo.updatedAt)).getMonth() + 1}/${(new Date(userInfo.updatedAt)).getFullYear()}`}</p>
                </div>
                <table className="text-xs my-3">
                    <tbody>
                    <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                        <td className="px-2 py-2">{userInfo.emailAddresses[0].emailAddress}</td>
                    </tr>
                    <tr>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Course Name</td>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Course Progress</td>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Start Exam</td>
                        <td className="px-2 py-2 text-gray-500 font-semibold">Final Exam</td>
                    </tr>
                    {courserWithProgress.map((course, index) => {
                        return(
                            <tr key={index}>
                                <td className="px-2 py-2 text-gray-900 font-semibold">{course.title}</td>
                                <td className="px-2 py-2 text-gray-900 font-semibold">%{course.progress}</td>
                            </tr>
                        )
                    })}

                </tbody>
                </table>
    
                
    
            </div>
        </div>
    </div>
    
    </div></div>
  )
}

export default UserProfile