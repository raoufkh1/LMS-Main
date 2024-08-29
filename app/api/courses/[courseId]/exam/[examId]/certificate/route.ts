import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendMail } from "@/actions/set-emails";

export async function POST(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const exam = await db.exam.findUnique({
      where: {
        id: params.examId,
      },
      include: {
        course: true,
      },
    });

    if (!exam) {
      return new NextResponse("Unauthorized", { status: 503 });
    }

    const certificate = await db.certificate.create({
      data: {
        examId: params.examId,
        courseTitle: exam.course.title,
        userId: userId
      },
    });
    console.log("line 37", certificate)
    return NextResponse.json(certificate);
  } catch (error) {
    console.error("CERTIFICATE_ID_EXAM", error);
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
