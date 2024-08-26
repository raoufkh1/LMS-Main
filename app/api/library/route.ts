import { auth } from "@clerk/nextjs/server";
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
                context:context.replace(`<p data-f-id="pbf" style="text-align: center; font-size: 14px; margin-top: 30px; opacity: 0.65; font-family: sans-serif;">Powered by <a href="https://www.froala.com/wysiwyg-editor?pb=1" title="Froala Editor">Froala Editor</a></p>`, "")
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