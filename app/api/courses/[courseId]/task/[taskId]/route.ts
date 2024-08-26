import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; taskId: string } }
  ) {
    try {
      const { userId } = auth();
      const { isPublished, ...values } = await req.json();
  
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
  
      const task = await db.task.update({
        where: {
          id: params.taskId,
          courseId: params.courseId,
        },
        data: {
          ...values,
        },
      });
  
      return NextResponse.json(task);
    } catch (error) {
      console.log("[COURSES_CHAPTER_ID]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string,taskId:string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const task = await db.task.findUnique({
        where: {
          id: params.taskId,
        }
      });
  
      if (!task) {
        return new NextResponse("Not found", { status: 404 });
      }
  
      const deletedTask = await db.task.delete({
        where: {
          id: params.taskId,
        },
      });
  
      return NextResponse.json(deletedTask);
    } catch (error) {
      console.log("[COURSE_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

  export async function GET(req: Request, { params }: { params: {taskId:string } }) {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const attachmentsWithUsers = []
      const attachments = await db.taskAttachment.findMany({where: {taskId:params.taskId}})
      console.log(attachments)
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        if(attachment){
            let user = await clerkClient.users.getUser(attachment.userId)
            attachmentsWithUsers.push({user, attachment})
        }
      }
      return NextResponse.json(attachmentsWithUsers);
    } catch (error) {
      console.log("[COURSES]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }