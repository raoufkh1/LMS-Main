import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { chapterId: string; lessonId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted,startedAt } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: params.lessonId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        lessonId: params.lessonId,
        isCompleted,
        startedAt: startedAt
      },
    });
    const userStats = await db.userStats.findUnique({
      where: {
        id: userId
      }
    })
    console.log(userStats)
    if (userStats){
      const editedUserStats = await db.userStats.update({
        where: {
          id: userId
        },
        data: {
          lessonsCompleted: isCompleted? userStats.lessonsCompleted! + 1 : userStats.lessonsCompleted! - 1
        }
      })
    }
    else{
      const newUserStats = await db.userStats.create({
        data: {
          id: userId,
          lessonsCompleted: 1
        }
      })
    }
    console.log(userProgress)
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[CHAPTER_ID_PROGRESS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
