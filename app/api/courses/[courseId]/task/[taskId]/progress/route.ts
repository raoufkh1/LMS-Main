import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string ; taskId : string } }
) {
  try {
    const { userId } = auth();
    const {isCompleted} = await req.json()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const taskProgress= await db.userProgress.findFirst({
      where: {
        userId,
        lessonId: params.taskId
      }
    })
    if(taskProgress) {
      await db.userProgress.update({
        where: {
          id: taskProgress.id
        },
        data: {
          isCompleted: isCompleted
        }
      })
    }
    else{
      await db.userProgress.create({
        data: {
          lessonId: params.taskId,
          userId,
          isCompleted
        }
      })
    }
    

    const publishedTask = await db.task.update({
      where: {
        id: params.taskId,
        
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedTask);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
