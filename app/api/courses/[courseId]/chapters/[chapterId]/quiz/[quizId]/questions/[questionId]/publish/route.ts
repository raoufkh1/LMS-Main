import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; quizId: string; questionId: string } }
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

    const question = await db.quizQuestion.findUnique({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
      include: {
        options: true,
      },
    });

    if (
      !question ||
      !question.prompt ||
      !question.options.every((option) => option.text) ||
      !question.answer
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedQuestion = await db.quizQuestion.update({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedQuestion);
  } catch (error) {
    console.log("[QUIZ_QUESTION_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
