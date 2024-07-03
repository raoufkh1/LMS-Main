import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function PATCH(
  req: Request,
) {
  try {
    const { userId } = auth();
    const { context } = await req.json();
    
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contextDb = await db.libraryText.findFirst()
    if (contextDb){
        const newContext = await db.libraryText.update({
            where: {
                id: contextDb.id

            },
            data: {
                context:context
            }
        })
    }
    else{
        const newContext = await db.libraryText.create({data: {context: context}})
    }
    return NextResponse.json(context);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}