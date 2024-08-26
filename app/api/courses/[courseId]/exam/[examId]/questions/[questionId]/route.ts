import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; examId: string; questionId: string } }
) {

  try {
    debugger;
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

    const question = await db.examQuestion.findUnique({
      where: {
        id: params.questionId,
        examId: params.examId,
      },
    });

    if (!question) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedQuestion = await db.examQuestion.delete({
      where: {
        id: params.questionId,
      },
    });

    const publishedQuestionInExam = await db.examQuestion.findMany({
      where: {
        examId: params.examId,
        isPublished: true,
      },
    });

    if (!publishedQuestionInExam.length) {
      await db.examQuestion.update({
        where: {
          id: params.examId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedQuestion);
  } catch (error) {
    console.log("[QUESTION_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; examId: string; questionId: string } }
) {
  try {
  debugger;

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

    const question = await db.examQuestion.update({
      where: {
        id: params.questionId,
        examId: params.examId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[EXAM_QUESTION_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
