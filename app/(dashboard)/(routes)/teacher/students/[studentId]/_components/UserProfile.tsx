import { getCourses } from '@/actions/get-courses'
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs'
import { Progress } from '@radix-ui/react-progress'
import React from 'react'
interface PageProps {
    params: { studentId: string };
  }
const UserProfile = async ({ params}:PageProps) => {
    const userInfo = await clerkClient.users.getUser(params?.studentId)
    const courserWithProgress:any = await getCourses({userId: params?.studentId})
    
  return (
    <div>
    <div className="flex w-full justify-center">
    
    <div className="">
        <div className="bg-white shadow-2xl rounded-lg py-3 px-3">
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
                    {courserWithProgress.map(async (course:any, index:number) => {
                        const exams = course?.exams
                        const startCourse = exams.find((e:any) => {return e.starterExam})
                        const finalCourse = exams.find((e:any) => {return !e.starterExam})
                        console.log("LINE42" ,startCourse)
                        
                        const firstExamsPrgress = startCourse ? await db.userProgress.findFirst({
                            where: {
                                lessonId: startCourse?.id,
                                userId: params.studentId
                            }
                        }) : null
                        const finalExamsPrgress = finalCourse ? await db.userProgress.findFirst({
                            where: {
                                lessonId: finalCourse?.id,
                                userId: params.studentId
                            }
                        }) : null
                            return(
                                <tr key={index}>
                                    <td className="px-2 py-2 text-gray-900 font-semibold">{course.title}</td>
                                    <td className="px-2 py-2 text-gray-900 font-semibold">%{Math.round(course.progress) }</td>
                                    <td className="px-2 py-2 text-gray-900 font-semibold">{firstExamsPrgress?.isCompleted == true ? "passed" : "not passed"}</td>
                                    <td className="px-2 py-2 text-gray-900 font-semibold">{finalExamsPrgress?.isCompleted == true ? "passed" : "not passed"}</td>
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