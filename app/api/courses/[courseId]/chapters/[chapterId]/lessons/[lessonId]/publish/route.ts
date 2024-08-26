import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; lessonId: string } }
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

    const lesson = await db.lesson.findUnique({
      where: {
        id: params.lessonId,
        chapterId: params.chapterId,
      },
    });

    if (!lesson || !lesson.title || (!lesson.description && !lesson.videoUrl)) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedLesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        chapterId: params.chapterId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedLesson);
  } catch (error) {
    console.log("[LESSON_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
