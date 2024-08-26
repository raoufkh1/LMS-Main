import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { title, description } = await req.json();

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
      console.log("====================================");
      console.log("HAS_NO_COURSE", userId, params.courseId);
      console.log("====================================");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const quiz = await db.quiz.create({
      data: {
        title,
        description,
        chapterId: params.chapterId,
        userId,
      },
    });

    console.log("====================================");
    console.log(quiz);
    console.log("====================================");

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("CHAPTER_ID_QUIZ", error);
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
