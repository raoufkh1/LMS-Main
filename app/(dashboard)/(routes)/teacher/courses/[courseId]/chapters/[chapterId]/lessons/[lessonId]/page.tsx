import { auth } from "@clerk/nextjs/server";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { LessonTitleForm } from "./_components/lesson-title-form";
import { LessonDescriptionForm } from "./_components/lesson-description-form";
import { LessonVideoForm } from "./_components/lesson-video-form";
import { LessonActions } from "./_components/lesson-actions";
import { headers } from "next/headers";

const LessonIdPage = async ({
  params,
}: {
  params: { chapterId: string; lessonId: string; courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const headersList = headers();
  const domain = headersList.get('host') || "";
  const fullUrl = headersList.get('referer') || "";
  const isIntroductionCoursePage:boolean = fullUrl?.includes(process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID!);

  const lesson = await db.lesson.findUnique({
    where: {
      id: params.lessonId,
      chapterId: params.chapterId,
    },
  });

  if (!lesson) {
    return redirect("/");
  }

  const requiredFields = !isIntroductionCoursePage ? [lesson.title, lesson.description || lesson.videoUrl] : [lesson.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
      
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!lesson.isPublished && (
        <Banner
          variant="warning"
          label="هذا الدرس غير منشور لن يكون مرئيا في الدورة"
        />
      )}
      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`${isIntroductionCoursePage ? `/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}` : `/teacher/courses/${params.courseId}/chapters/${params.chapterId}`} `}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isIntroductionCoursePage ? "العودة الى التعريف بالموقع" : `              العودة إلى إعداد الفصل
`}
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">إنشاء الدرس</h1>
                <span className="text-sm text-slate-700">
                  {
                    isIntroductionCoursePage ? `أكمل كافة الحقول ${completionText} - يجب أن يكون لديك
                      فيديو` : `أكمل كافة الحقول ${completionText} - يجب أن يكون لديك
                    وصف أو فيديو`
                  }
                
                </span>
              </div>
              {
                !isIntroductionCoursePage &&
                  <LessonActions
                    disabled={!isComplete}
                    courseId={params.courseId}
                    chapterId={params.chapterId}
                    lessonId={params.lessonId}
                    isPublished={lesson.isPublished}
                  />
              }
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {
            

            <div className="space-y-4">
              <div>
                {
                  !isIntroductionCoursePage && (
                    <div><div className="flex items-center gap-x-2">

                    <IconBadge icon={LayoutDashboard} />
                    <h2 className="text-xl">تخصيص الدرس الخاص بك</h2>
                  </div>
                  <LessonTitleForm
                    initialData={lesson}
                    courseId={params.courseId}
                    chapterId={params.chapterId}
                    lessonId={params.lessonId}
                  /></div>
                  )
                }
                
                <LessonDescriptionForm
                  initialData={lesson}
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                  lessonId={params.lessonId}
                />
              </div>
            </div>
            
          }
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">أضف فيديو</h2>
            </div>
            <LessonVideoForm
              initialData={lesson}
              chapterId={params.chapterId}
              lessonId={params.lessonId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonIdPage;
