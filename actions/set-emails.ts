import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { env } from 'process'


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        pass: env.SMTP_PASS,
        user: env.SMTP_USER
    }
}as SMTPTransport.Options)


export const sendMail = async({to,from,subject,body} : {to:string, from:string, subject:string, body:string}) => {

    return await transport.sendMail({
        to,
        from,
        subject,
        html: body
    })
}