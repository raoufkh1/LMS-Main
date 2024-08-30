'use client'
import { Course, Exam } from '@prisma/client';
import { useRouter } from 'next/navigation';

import React from 'react'
interface PageProps {
    studentId: string;
    firstExamsPrgress: number;
    finalExamsPrgress: number;
    lessonsCompleted: number;
    quizsCompleted: number;
    course: Course & {exams : Exam[], progress: number};
    timeString: string
  }
const UserStats = ({ timeString,studentId,course,finalExamsPrgress,firstExamsPrgress,lessonsCompleted,quizsCompleted}:PageProps) => {
    const router = useRouter()
    const handleNavigate = () => {
        
        return router.push(`/teacher/students/${studentId}/course/${course.id}`)
    }
    return(
        <tr className='text-base'>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{course.title}</td>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">%{Math.round(course?.progress) }</td>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">%{firstExamsPrgress ? firstExamsPrgress : 0}</td>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">%{finalExamsPrgress ? finalExamsPrgress : 0}</td>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{lessonsCompleted}</td>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{quizsCompleted}</td>
            <td className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">{timeString}</td>
            <td onClick={handleNavigate} className="px-2 py-2 cursor-pointer hover:text-gray-800 font-semibold">تقرير</td>
        </tr>
    )
}

export default UserStats