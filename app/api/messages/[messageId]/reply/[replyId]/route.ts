import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request,{ params }: { params: { replyId: string,messageId:string } }) {
    try {
      const { userId } = auth();
      
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const messageDeleted = await db.reply.delete({
        where: {
          id: params.replyId
        }
      })
      const currentMessage = await db.message.findUnique(
        {
          where: {
            id: params.messageId
          }
        }
      )
      const message = await db.message.update({
          where: {
              id: params.messageId
          },
          data: {
              repliesCount:  currentMessage?.repliesCount! - 1
          }
      })
      await pusherServer.trigger("chat-event", "delete-reply", {
        messageId : params.replyId
      })
    return NextResponse.json(messageDeleted);

    }
    catch(e) {
      console.log(e)
    }
  }