import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";
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

  export async function GET(req: Request, {params}: {params: {messageId: string}}) {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
    const replies = await db.reply.findMany({where: {messageId:params.messageId},orderBy:{updatedAt: "desc"}})
    const message:any = await db.message.findUnique({where: {id: params.messageId}})
    let user:any = await clerkClient.users.getUser(message?.userId!)
    user = JSON.parse(JSON.stringify(user))
    const repliesWithUsers: { msg: { id: string; userId: string | null; context: string; replyId: string | null; messageId: string | null; createdAt: Date; updatedAt: Date }; user: User }[] = []
        for(let i = 0; i < replies.length; i++) {
          let reply = replies[i]
            console.log("LINE21" + reply.userId)
            if(reply.userId){
                const replyOwner = await clerkClient.users.getUser(reply.userId)
                const tempMessage = {msg:reply, user: replyOwner}
                repliesWithUsers.push(tempMessage)
                console.log(JSON.stringify(tempMessage))
            }
        }
      return NextResponse.json({replies :repliesWithUsers, orgin: {user:user, message:message }});
    } catch (error) {
      console.log("[COURSES]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }