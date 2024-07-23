import { getCourses } from '@/actions/get-courses'
import { clerkClient } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const UserCard = async () => {
    const users = await clerkClient.users.getUserList()
    return (


        <div className="w-full  p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 ">
                <h5 className="text-xl w-full font-bold leading-none text-gray-600 dark:text-white text-center">تقرير المتدربين</h5>

            </div>
            <div className="flow-root">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className='w-full '>
                        <td className='text-center'>
                            
                        </td>
                        <td className='text-center'>
                            الكورسات المكتملة
                        </td>
                        <td className='text-center'>
                             
                        </td>
                    </tr>
                    {
                        users.map(async (user, index) => {
                            const courses = await getCourses({userId:user.id})
                            const completedCourses = courses.filter((e) => e.progress == 100)
                            console.log(completedCourses)
                            return (
                                <tr key={index} className="py-3 w-full sm:py-4">
                                        <td className='flex'>
                                            <div className="flex-shrink-0">
                                                <img className="w-8 h-8 rounded-full" src={user.imageUrl} alt="Neil image" />
                                            </div>
                                            <div className="flex-1 min-w-0 ms-4">
                                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                    {`${user.firstName} ${user.lastName ? user.lastName : ""}`}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                    {user.emailAddresses[0].emailAddress}
                                                </p>
                                            </div>

                                        </td>
                                        <td className='text-center'> {completedCourses.length} </td>
                                        <td className='flex justify-center'>
                                            
                                            <Link className='text-white font-normal text-xl transition-all shadow-3xl rounded-md hover:bg-[rgba(0,118,255,0.9)] bg-[#2655a3] py-0 px-14 inline-block outline-0 cursor-pointer border-none leading-[45px] h-[45px]' href={`/teacher/students/${user.id}`}>تقرير</Link>
                                        </td>
                                </tr>
                )
                        })
                    }


            </table>
        </div>
        </div >

    )
}

export default UserCard