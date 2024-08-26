import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; quizId: string } }
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
        id: params.quizId,
        chapterId: params.chapterId,
      },
      include: {
        questions: true,
      },
    });

    if (!quiz || !quiz.title || !quiz.description || !quiz.questions) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedQuiz = await db.quiz.update({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedQuiz);
  } catch (error) {
    console.log("[QUIZ_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
