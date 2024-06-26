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
    const userMessages = await db.message.findMany({
        where: {
            userId: params?.studentId
        }
    })
    console.log(userMessages)
    const userMessagesSorted = userMessages.sort((a:any,b:any)=> b.createdAt-a.createdAt)
    const lastMessage = userMessagesSorted.length > 0 ? userMessagesSorted[0] : null
  return (
    <div>
    <div className="flex w-full justify-center">
    
    <div className="">
        <div className="bg-white shadow-2xl rounded-lg py-3 px-3">
            <div className="photo-wrapper p-2">
                <img className="w-32 h-32 rounded-full mx-auto" src={userInfo.imageUrl} alt="John Doe"/>
            </div>
            <div className="p-2">
                <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{`${userInfo.firstName} ${userInfo.lastName ? userInfo.lastName : ""}`}</h3>
                <div className="text-center text-gray-400 text-xs font-semibold">
                    <p>اخر تسجيل دخول:{`${(new Date(userInfo.updatedAt)).getDate()}/${(new Date(userInfo.updatedAt)).getMonth() + 1}/${(new Date(userInfo.updatedAt)).getFullYear()}`}</p>
                    <p>اخر رسالة :{lastMessage ?`${ (new Date(lastMessage?.updatedAt!)).getHours()}:${(new Date(lastMessage?.updatedAt!)).getMinutes() }:${(new Date(lastMessage?.updatedAt!)).getSeconds()}` +` - ` +  `${(new Date(lastMessage?.updatedAt!)).getDate()}/${(new Date(lastMessage?.updatedAt!)).getMonth() + 1}/${(new Date(lastMessage?.updatedAt!)).getFullYear()}` : `لم يرسل اي رسالة`}</p>
                </div>
                <table className="text-xs my-3" dir='rtl'>
                    <tbody>
                    <tr className='text-base'>
                        <td className="px-2 py-2 text-gray-600  font-semibold">الإيميل</td>
                        <td className="px-2 py-2 text-gray-800" >{userInfo.emailAddresses[0].emailAddress}</td>
                    </tr>
                    <tr className='text-base'>
                        <td className="px-2 py-2 text-gray-600 font-semibold">اسم الكورس</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold">التقدم</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold">الامتحان الابتدائي</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold">الامتحان النهائي</td>
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
                        if(course.id != process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID){
                            return(
                                <tr key={index} className='text-base'>
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{course.title}</td>
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">%{Math.round(course.progress) }</td>
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">%{firstExamsPrgress?.percentage ? firstExamsPrgress?.percentage : 0}</td>
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">%{finalExamsPrgress?.percentage ? finalExamsPrgress?.percentage : 0}</td>
                                </tr>
                            )

                        }

                        
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