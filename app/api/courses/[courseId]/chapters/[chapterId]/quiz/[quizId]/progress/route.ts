import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { chapterId: string; quizId: string } }
) {
  try {
    const { userId } = auth();
    const { points } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userQuizPoints = await db.userQuizPoints.upsert({
      where: {
        userId_quizId: {
          userId,
          quizId: params.quizId,
        },
      },
      update: {
        points,
      },
      create: {
        userId,
        quizId: params.quizId,
        points,
      },
    });
    const userStats = await db.userStats.findUnique({
      where: {
        id: userId
      }
    })
    if (userStats){
      const editedUserStats = await db.userStats.update({
        where: {
          id: userId
        },
        data: {
          quizsCompleted: userStats.quizsCompleted! + 1
        }
      })
    }
    else{
      const newUserStats = await db.userStats.create({
        data: {
          id: userId,
          quizsCompleted: 1
        }
      })
    }
    return NextResponse.json(userQuizPoints);
  } catch (error) {
    console.log("[CHAPTER_ID_POINTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
