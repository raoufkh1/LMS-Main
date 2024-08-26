import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { examId: string; questionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const optionQuestion = await db.examQuestion.findUnique({
      where: {
        id: params.questionId,
        examId: params.examId,
      },
    });

    if (!optionQuestion) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.examQuestionOption.update({
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
