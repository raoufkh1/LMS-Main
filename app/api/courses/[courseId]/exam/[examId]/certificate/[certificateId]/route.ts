import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendMail } from "@/actions/set-emails";

export async function GET(
  req: Request,
  { params }: { params: { certificateId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const certificate = await db.certificate.findUnique({
      where: {
        id: params.certificateId,
        userId: userId,
      },
    });

    if (!certificate) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(certificate);
  } catch (error) {
    console.log("[CERTIFICATE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; examId: string; certificateId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const exam = await db.exam.findUnique({
      where: {
        id: params.examId,
        courseId: params.courseId,
      },
    });

    if (!exam) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedCertificate = await db.certificate.delete({
      where: {
        id: params.certificateId,
      },
    });

    return NextResponse.json(deletedCertificate);
  } catch (error) {
    console.log("[CERTIFICATE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { examId: string; certificateId: string } }
) {
  try {
    const { userId } = auth();
    const { ...values } = await req.json();
    sendMail({to: "raoufg716@gmail.com", from:'sender19321232@gmail.com', body: "<h1>HELLO WORLD</h1>", subject: "the most importance subjecct in the wooorld"})

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const certificate = await db.certificate.update({
      where: {
        id: params.certificateId,
        examId: params.examId,
      },
      data: {
        userId,
        ...values,
      },
    });
    console.log("LINE:106", certificate)
    return NextResponse.json(certificate);
  } catch (error) {
    console.log("[CERTIFICATE_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
