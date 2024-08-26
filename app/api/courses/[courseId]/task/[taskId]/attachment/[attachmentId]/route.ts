import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string, attachmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    

    const attachment = await db.taskAttachment.delete({
      where: {
        taskId: params.taskId,
        userId: userId,
        id: params.attachmentId,
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
            const completedTask = await db.userProgress.update({
                where: {
                    id: previousAttach?.id
                },
                data: {
                    isCompleted: false,
                }
            })
        }
    }
    else{
        const completedTask = await db.userProgress.create({
            data:{
                userId: userId,
                lessonId: params.taskId,
                isCompleted: false
            }
        })
    }
    return NextResponse.json(attachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
