import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
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

    const { list } = await req.json();

    const questionQuiz = await db.quiz.findUnique({
      where: {
        id: params.quizId,
        chapterId: params.chapterId,
      },
    });

    if (!questionQuiz) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.quizQuestion.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
