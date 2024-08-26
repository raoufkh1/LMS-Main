import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function GET(
  req: Request,
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dialogStatus = await db.assistPages.findFirst({
        where: {
            userId
        }
    })
    return NextResponse.json(dialogStatus);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
    req: Request,
  ) {
    try {
      const { userId } = auth();
      const {object} = await req.json()
      console.log(object)
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const dialogPrev = await db.assistPages.findFirst({where: {userId}})
      if(dialogPrev){
        const dialogNew = await db.assistPages.update({
            where: {
                id: dialogPrev.id
            },
            data: {
                ...object
            }
        })
      }
      else{
          const dialogStatus = await db.assistPages.create({
              data: {
                  userId,
                  ...object
              }
          })

      }
      return NextResponse.json(dialogPrev);
    } catch (error) {
      console.log("[COURSES]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }