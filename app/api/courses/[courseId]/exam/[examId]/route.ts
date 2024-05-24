import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
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

    const exam = await db.exam.findUnique({
      where: {
        id: params.examId,
        courseId: params.courseId,
      },
    });

    if (!exam) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedExam = await db.exam.delete({
      where: {
        id: params.examId,
      },
    });

    const publishedExamInCourse = await db.exam.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedExamInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedExam);
  } catch (error) {
    console.log("[EXAM_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; examId: string } }
) {
  try {
    const { userId } = auth();
    const { ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    const studentId = values?.userId === userId;

    if (!ownCourse && !studentId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exam = await db.exam.update({
      where: {
        id: params.examId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
