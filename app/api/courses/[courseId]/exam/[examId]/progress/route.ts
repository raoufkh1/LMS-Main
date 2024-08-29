import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId } = auth();
    const { percentage, userSelections } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    

    
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
          percentage: percentage
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
          percentage: percentage
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
          options: JSON.stringify(userSelections)
        }
      })
    }
    else{
      await db.examOptions.create({
        data: {
          examId: params.examId,
          userId: userId,
          options: JSON.stringify(userSelections)
        }
      })
    }
    return NextResponse.json(examProgress);
  } catch (error) {
    console.log("[EXAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
    req: Request,
    { params }: { params: { chapterId: string; examId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const selections = await db.examOptions.findFirst({
        where:{
          userId,
          examId: params.examId
        }
      })
      
      return NextResponse.json(selections);
    } catch (error) {
      console.log("[CHAPTER_ID_POINTS]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }