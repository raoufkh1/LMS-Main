import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req: Request,{ params }: { params: { messageId: string } }) {
    try {
      const { userId } = auth();
      
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      const messageDeleted = await db.message.delete({
        where: {
          id: params.messageId
        }
      })
      await pusherServer.trigger("chat-event", "delete-message", {
        messageId : params.messageId
      })
    return NextResponse.json(messageDeleted);

    }
    catch(e) {
      console.log(e)
    }
  }