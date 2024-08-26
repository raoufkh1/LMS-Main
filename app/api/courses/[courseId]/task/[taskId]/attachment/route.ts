import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string, taskId:string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    

    const attachment = await db.taskAttachment.create({
      data: {
        url,
        taskId: params.taskId,
        userId: userId,
        name: url.split("/").pop(),
      }
    });
    const previousAttach = await db.userProgress.findFirst({
        where: {
            userId: userId,
            lessonId: params.taskId,
        }
    })
    if(previousAttach){
        if(previousAttach?.isCompleted){
    
        }
        else{
            
            const completedTask = await db.userProgress.update({
                where: {
                    id: previousAttach?.id
                },
                data: {
                    isCompleted: true,
                }
            })
        }

    }
    else{
        const completedTask = await db.userProgress.create({
            data:{
                userId: userId,
                lessonId: params.taskId,
                isCompleted: true
            }
        })
    }
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}