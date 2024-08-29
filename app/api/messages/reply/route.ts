import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { messageId,context } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const reply = await db.reply.create({
      data:{
        messageId: messageId,
        userId: userId,
        context: context,

      }
    })
    
    console.log(reply)
    const currentMessage = await db.message.findUnique(
      {
        where: {
          id: messageId
        }
      }
    )
    const message = await db.message.update({
        where: {
            id:messageId
        },
        data: {
            repliesCount:  currentMessage?.repliesCount! + 1
        }
    })
    
    
    const user = await clerkClient.users.getUser(userId)
    let tempMsg = { msg:reply, user: user }

      await pusherServer.trigger("chat-event", "update-reply", {
        tempMsg
      })

    return NextResponse.json(message);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
// export async function GET(req: Request) {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     let messagesWithUser: { msg: { id: string; userId: string | null; context: string; messageId: string | null; createdAt: Date; updatedAt: Date }; user: { firstName: string | null; lastName: string | null } }[] = []
//     const messages = await db.message.findMany({
//       orderBy: {
//           createdAt: 'desc'
//       }
//   })
//   await Promise.all(
      
//       messages.map(async (msg:any) => {
//           if (msg.userId != "nil") {
  
//               const response = await clerkClient.users.getUser(msg.userId)
//               let tempMsg = { msg, user: response }
//               messagesWithUser.push(tempMsg)
//           }
//       })
//   )
//   const sortedMessages = messagesWithUser.sort((a:any,b:any)=> b.msg.createdAt-a.msg.createdAt);
//     return NextResponse.json(sortedMessages);
//   } catch (error) {
//     console.log("[COURSES]", error);
//     return new NextResponse("Internal Error", { status: 500 });
//   }
// }
