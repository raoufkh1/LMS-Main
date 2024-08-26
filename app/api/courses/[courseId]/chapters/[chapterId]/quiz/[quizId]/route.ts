import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
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

    const quiz = await db.quiz.findUnique({
      where: {
        id: params.chapterId,
        chapterId: params.chapterId,
      },
    });

    if (!quiz) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedQuiz = await db.quiz.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedQuizInChapter = await db.quiz.findMany({
      where: {
        chapterId: params.chapterId,
        isPublished: true,
      },
    });

    if (!publishedQuizInChapter.length) {
      await db.chapter.update({
        where: {
          id: params.chapterId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedQuiz);
  } catch (error) {
    console.log("[EXAM_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();
    const { ...values } = await req.json();

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

    if (!ownCourse && !studentId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.update({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
