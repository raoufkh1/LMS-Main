import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { context } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const message = await db.message.create({
      data:{
        context: context,
        userId
      }
    })
    const user = await clerkClient.users.getUser(userId)
    let tempMsg = { msg:message, user: { firstName: user.firstName, lastName: user.lastName } }

      await pusherServer.trigger("chat-event", "update-message", {
        tempMsg
      })

    console.log(tempMsg)
    return NextResponse.json(tempMsg);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    let messagesWithUser: { msg: { id: string; userId: string | null; context: string; messageId: string | null; createdAt: Date; updatedAt: Date }; user: { firstName: string | null; lastName: string | null } }[] = []
    const messages = await db.message.findMany({
      orderBy: {
          createdAt: 'desc'
      }
  })
  await Promise.all(
      
      messages.map(async (msg:any) => {
          if (msg.userId != "nil") {
  
              const response = await clerkClient.users.getUser(msg.userId)
              let tempMsg = { msg, user: { firstName: response.firstName, lastName: response.lastName } }
              messagesWithUser.push(tempMsg)
          }
      })
  )
  const sortedMessages = messagesWithUser.sort((a:any,b:any)=> b.msg.createdAt-a.msg.createdAt);
    return NextResponse.json(sortedMessages);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}