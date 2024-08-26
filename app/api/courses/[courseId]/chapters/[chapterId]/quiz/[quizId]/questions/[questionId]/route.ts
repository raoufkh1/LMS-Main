import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
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
    });

    if (!question) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedQuestion = await db.quizQuestion.delete({
      where: {
        id: params.questionId,
      },
    });

    const publishedQuestionInExam = await db.quizQuestion.findMany({
      where: {
        quizId: params.quizId,
        isPublished: true,
      },
    });

    if (!publishedQuestionInExam.length) {
      await db.quizQuestion.update({
        where: {
          id: params.quizId,
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
  }: { params: { courseId: string; quizId: string; questionId: string } }
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

    const question = await db.quizQuestion.update({
      where: {
        id: params.questionId,
        quizId: params.quizId,
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
