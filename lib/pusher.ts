import { env } from 'process'
import PusherServer from 'pusher'
import PusherClient from 'pusher-js'
console.log(process.env.NEXT_PUBLIC_PUSHER_APP_ID!)

export const pusherServer = new PusherServer({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key:process.env.NEXT_PUBLIC_PUSHER_KEY!,
    cluster:process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
    useTLS: true
})
export const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster:"eu",
})