import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exam = await db.exam.findUnique({
      where: {
        id: params.examId,
        courseId: params.courseId,
      },
    });

    if (!exam) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedExam = await db.exam.delete({
      where: {
        id: params.examId,
      },
    });

    const publishedExamInCourse = await db.exam.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedExamInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedExam);
  } catch (error) {
    console.log("[EXAM_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId } = auth();
    const { ...values } = await req.json();
    console.log(values)
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    const studentId = values?.userId === userId;
    console.log(values)
    if (!ownCourse && !studentId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exam = await db.exam.update({
      where: {
        id: params.examId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });
    const examProgress = await db.userProgress.findFirst({
      where:{
        userId,
        lessonId: params.examId
      }
    })
    if(examProgress){
      const completeExam = await db.userProgress.update({
        data: {
          userId: userId,
          lessonId: params.examId,
          isCompleted: true,
          percentage: values.afterScore
        },
        where: {
          id:examProgress.id
        }
      })

    }
    else{
      const completeExam = await db.userProgress.create({
        data:{
          userId: userId,
          lessonId: params.examId,
          isCompleted: true,
          percentage: values.afterScore
        }
      })
    }
    const userStats = await db.userStats.findUnique({
      where: {
        id: userId
      }
    })
    if (userStats){
      const editedUserStats = await db.userStats.update({
        where: {
          id: userId
        },
        data: {
          examsCompleted: userStats.examsCompleted! + 1 
        }
      })
    }
    else{
      const newUserStats = await db.userStats.create({
        data: {
          id: userId,
          examsCompleted: 1
        }
      })
    }
    const oldSelection = await db.examOptions.findFirst({
      where: {
        examId: params.examId,
        userId
      }
    })
    if(oldSelection){
      await db.examOptions.update({
        where: {
          id:oldSelection.id
        },
        data: {
          options: JSON.stringify(values.userSelections)
        }
      })
    }
    else{
      await db.examOptions.create({
        data: {
          examId: params.examId,
          userId: userId,
          options: JSON.stringify(values.userSelections)
        }
      })
    }
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
