import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
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

    if (!lesson) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedLesson = await db.lesson.delete({
      where: {
        id: params.lessonId,
      },
    });

    const publishedLessonInChapter = await db.lesson.findMany({
      where: {
        chapterId: params.chapterId,
        isPublished: true,
      },
    });

    if (!publishedLessonInChapter.length) {
      await db.chapter.update({
        where: {
          id: params.chapterId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedLesson);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; lessonId: string } }
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

    const lesson = await db.lesson.update({
      where: {
        id: params.lessonId,
        chapterId: params.chapterId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
