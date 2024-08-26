import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId } = auth();
    const { prompt } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const questionExam = await db.exam.findUnique({
      where: {
        id: params.examId,
        courseId: params.courseId,
      },
    });

    if (!questionExam) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastQuestion = await db.examQuestion.findFirst({
      where: {
        examId: params.examId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

    const question = await db.examQuestion.create({
      data: {
        prompt,
        examId: params.examId,
        position: newPosition,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
