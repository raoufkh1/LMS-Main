
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatWidget } from "./_components/chatbot-popup";
import { headers } from "next/headers";

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const course:any = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          lessons: {
            where: {
              isPublished: true,
            },
            include: {
              userProgress: {
                where: {
                  userId,
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
          quiz: {
            where: {
              isPublished: true,
            },
            include: {
              userQuizPoints: {
                where: {
                  userId,
                },
              },
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const exam = await db.exam.findMany({
    where: {
      courseId: params.courseId,
      userId: userId,
    },
    include: {
      questions: {
        where: {
          isPublished: true,
        },
        include: {
          options: true,
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }
  let starterExam = exam.filter((e) => e.starterExam == true)[0]
  
  let progressCount = await getProgress(userId, course.id);
  const headersList = headers();
  const fullUrl = headersList.get('referer') || "";
  const isInExam = fullUrl.includes("exam") == true
  const totalExamScore =
    exam[0]?.afterScore && exam[0].beforeScore
      ? (exam[0]?.beforeScore + exam[0]?.afterScore) / 2
      : null;

  if (totalExamScore && totalExamScore >= 50 && progressCount < 100) {
    progressCount = Math.min(progressCount + 10, 100);
  }

  return (
    <div className="h-full">
      <div className="h-[80px] md:pr-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed right-0 inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pr-80 pt-[80px] h-full">{children}</main>
      {
        !isInExam && <div className="fixed left-5 bottom-5 z-50">
        <ChatWidget>
          <Button
            variant="outline"
            className="bg-emerald-600 rounded-full p-4 h-14 w-14 shadow-md hover:bg-emerald-600"
          >
            <MessageCircle size={30} color="white" />
          </Button>
        </ChatWidget>
      </div>
      }
      
    </div>
  );
};

export default CourseLayout;
