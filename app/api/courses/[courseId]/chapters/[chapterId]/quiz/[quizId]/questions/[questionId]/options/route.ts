import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { quizId: string; questionId: string } }
) {
  try {
    const { userId } = auth();
    const { text } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const optionQuestion = await db.quizQuestion.findUnique({
      where: {
        id: params.questionId,
        quizId: params.quizId,
      },
      include: {
        options: true,
      },
    });

    if (!optionQuestion) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastOption = await db.quizQuestionOption.findFirst({
      where: {
        questionId: params.questionId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastOption ? lastOption.position + 1 : 1;

    if (optionQuestion.options.length > 3) {
      return new NextResponse("Maximum question options reached", {
        status: 400,
      });
    } else {
      const option = await db.quizQuestionOption.create({
        data: {
          text,
          questionId: params.questionId,
          position: newPosition,
        },
      });

      return NextResponse.json(option);
    }
  } catch (error) {
    console.log("[QUESTION_OPTION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
