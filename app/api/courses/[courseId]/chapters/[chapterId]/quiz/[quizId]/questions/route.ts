import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();
    const { prompt } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const questionQuiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
    });

    if (!questionQuiz) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastQuestion = await db.quizQuestion.findFirst({
      where: {
        quizId: params.quizId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

    const question = await db.quizQuestion.create({
      data: {
        prompt,
        quizId: params.quizId,
        position: newPosition,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUIZ]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
