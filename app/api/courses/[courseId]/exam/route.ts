import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { title, description,starter } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(params.courseId)
    const exam = await db.exam.create({
      data: {
        title,
        description,
        courseId: params.courseId,
        userId,
        starterExam: starter ? true : false
      },
    });
    const course = await db.course.findUnique({
      where:{
        id:params.courseId
      }
    })
    console.log("====================================");
    console.log("====================================");

    return NextResponse.json(exam);
  } catch (error) {
    console.error("COURSE_ID_EXAM", error);
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
