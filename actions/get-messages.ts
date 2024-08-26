import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function getMessages(){
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
    return sortedMessages
}