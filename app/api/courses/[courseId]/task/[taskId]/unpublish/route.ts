import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string ; taskId : string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const task = await db.task.findUnique({
      where: {
        id: params.taskId,
        courseId: params.courseId,
      }
    });

    if (!task) {
      return new NextResponse("Not found", { status: 404 });
    }

 

    

    const publishedTask = await db.task.update({
      where: {
        id: params.taskId,
        
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(publishedTask);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
