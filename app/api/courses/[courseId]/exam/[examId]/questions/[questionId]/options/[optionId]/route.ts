import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      examId: string;
      questionId: string;
      optionId: string;
    };
  }
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

    const option = await db.examQuestionOption.findUnique({
      where: {
        id: params.optionId,
        questionId: params.questionId,
      },
    });

    if (!option) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const deletedOption = await db.examQuestionOption.delete({
      where: {
        id: params.optionId,
      },
    });

    const optionQuestion = await db.examQuestion.findUnique({
      where: {
        id: params.questionId,
        examId: params.examId,
      },
      include: {
        options: true,
      },
    });

    if (optionQuestion && optionQuestion?.options.length < 3) {
      await db.examQuestion.update({
        where: {
          id: params.questionId,
          examId: params.examId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedOption);
  } catch (error) {
    console.log("[QUESTION_OPTION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      examId: string;
      questionId: string;
      optionId: string;
    };
  }
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

    const option = await db.examQuestionOption.update({
      where: {
        id: params.optionId,
        questionId: params.questionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[QUESTION_OPTION_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
