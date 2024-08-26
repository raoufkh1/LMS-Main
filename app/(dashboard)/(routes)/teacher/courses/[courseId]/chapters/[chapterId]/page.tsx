import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookPlus,
  LayoutDashboard,
  ListEnd,
  LucideBookPlus,
  ShieldQuestion,
  Video,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterActions } from "./_components/chapter-actions";
import { LessonsForm } from "./_components/lessons-form";
import { QuizForm } from "./_components/quiz-form";
import { FcQuestions } from "react-icons/fc";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      quiz: true,
      lessons: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [
    chapter.title,
    chapter.lessons.some((lesson) => lesson.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="هذا الفصل غير منشور. لن يكون مرئيا في الدورة"
        />
      )}
      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة إلى الإعداد بالطبع
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">إنشاء الفصل</h1>
                <span className="text-sm text-slate-700">
                أكمل كافة الحقول {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">تخصيص الفصل الخاص بك</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LucideBookPlus} />
              <h2 className="text-xl">أضف درسا</h2>
            </div>
            <LessonsForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={params.courseId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FcQuestions} />
              <h2 className="text-xl">نشاط الفصل (اختياري)</h2>
            </div>
            <QuizForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={chapter.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
