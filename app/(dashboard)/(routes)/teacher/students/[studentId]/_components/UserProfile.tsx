import { getCourses } from '@/actions/get-courses'
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs'
import { Course } from '@prisma/client';
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
                        <td className="px-2 py-2 text-gray-600  font-semibold">الاختبار القبلي</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold">الاختبار البعدي</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold">الدروس المكتملة</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold">الانشطة المكتملة</td>
                        <td className="px-2 py-2 text-gray-600  font-semibold"> الوقت المتسغرق</td>
                    </tr>
                    {courserWithProgress.map(async (course:any, index:number) => {
                        let time = 0;
                        let timeString = ``
                        let lessonsCompleted = 0 
                        let quizsCompleted = 0 
                        let chapters = await db.chapter.findMany({
                            where: {
                                courseId: course.id
                            }
                        })
                        for (let i = 0; i < chapters.length; i++) {
                            const chapter = chapters[i];

                            const lessons = await db.lesson.findMany({
                                where: {
                                    chapterId: chapter.id
                                }
                            })
                            const quizs = await db.quiz.findMany({
                                where: {
                                    chapterId: chapter.id
                                }
                            })
                            for (let j = 0; j < lessons.length; j++) {
                                const lesson = lessons[j];
                                const isLessonCompleted = await db.userProgress.findFirst({
                                    where: {
                                        lessonId: lesson.id,
                                        userId: params.studentId
                                    }
                                })
                                let lessonTime = Math.floor(((Date.parse(`${isLessonCompleted?.updatedAt}`) - isLessonCompleted?.startedAt!) / 1000) % 60) 
                                time = (time ? time : 0) + lessonTime
                                console.log(course.id)
                                const hours = Math.floor(time / 3600);
                                time = time - hours * 3600;
                                const minutes = Math.floor(time / 60);
                                const seconds = time - minutes * 60;
                                let timeH = ((time / (1000 * 60 * 60)) % 24 )> 1 ? `ساعة${Math.round(time /3600)}` : ''
                                let timeM =  minutes >= 1 ? ` ${Math.round(time /60)}  دقيقة  ` : ''
                                console.log((time / 60) % 60)
                                let timeS =  seconds ? `${seconds} ثانية  ` : ''
                                timeString = timeH + " " +timeM + " " + timeS
                                if(isLessonCompleted?.isCompleted){
                                    lessonsCompleted = lessonsCompleted + 1 
                                }
                            }
                            for (let k = 0; k < quizs.length; k++) {
                                const quiz = quizs[k];
                                const isQuizCompleted = await db.userQuizPoints.findFirst({
                                    where: {
                                        quizId: quiz.id,
                                        userId: params.studentId
                                    }
                                })
                                if(isQuizCompleted){
                                    quizsCompleted = quizsCompleted + 1 
                                }
                            }
                        }
                        const exams = course?.exams
                        const startCourse = exams.find((e:any) => {return e.starterExam})
                        const finalCourse = exams.find((e:any) => {return !e.starterExam})
                        
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
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{lessonsCompleted}</td>
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{quizsCompleted}</td>
                                    <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{timeString}</td>
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