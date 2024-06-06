import { auth } from "@clerk/nextjs";
import {
  Chapter,
  Course,
  Lesson,
  UserProgress,
  Quiz,
  UserQuizPoints,
} from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";

import { CourseSidebarItem } from "./course-sidebar-item";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle, PlayCircle } from "lucide-react";
import { headers } from "next/headers";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[] | null;
        lock: Boolean
      })[];
      quiz: (Quiz & { userQuizPoints: UserQuizPoints[] | null }) | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const headersList = headers();

  const pathname = headersList.get("x-invoke-path") || "";

  const takingExamination = pathname?.includes("exam");
  const viewingCertificate = pathname?.includes("certificate");
  const takingQuiz = pathname?.includes("quiz");
  const starterExam = await db.exam.findFirst({
    where: {
      courseId: course.id,
      isPublished: true,
      starterExam: true
    },
    include: {
      certificate: true,
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
  const starterExamProgress = await db.userProgress.findFirst({
    where:{
      lessonId: starterExam?.id,
      userId: userId
    }
  })
  const exam:any = await db.exam.findFirst({
    where: {
      courseId: course.id,
      isPublished: true,
      starterExam: false
    },
    include: {
      certificate: true,
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

  const certificateId = exam?.certificate?.find(
    (certificate:any) =>
      {return certificate.userId === userId && certificate.nameOfStudent != null}
  )
  console.log("Line:75", certificateId)
  const hasCertificate = certificateId != undefined;
  const examCompleted = await db.userProgress.findFirst({
    where:{
      lessonId:exam?.id,
      userId:userId
    }
  })

  // if (progressCount === 100 && exam) {
  //   redirect(`/courses/${course.id}/exam/${exam.id}`);
  // }

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        <div className="mt-10">
          <CourseProgress variant="success" value={progressCount} />
        </div>
      </div>
      <div className="flex flex-col w-full">
      {starterExam && (
              <button
              type="button"
              disabled={true}
              className={cn(
                "flex items-center justify-end w-full gap-x-2 text-slate-600 text-sm font-[500] transition-all px-4 hover:text-slate-700 hover:bg-gray-300 border-r-4 border-opacity-0 hover:border-opacity-95 border-gray-600 h-full",
                pathname?.includes(starterExam.id) &&
                  "text-slate-700  hover:bg-gray-500 hover:text-slate-700"
              )}
            >
              <div className="flex items-center justify-between text-right w-full gap-x-2 py-4">
                {starterExamProgress?.isCompleted ? (
                  <CheckCircle
                    size={22}
                    className={cn(
                      "text-gray-700",
                      pathname?.includes(starterExam.id) && "text-gray-800"
                    )}
                  />
                ) : (
                  <PlayCircle
                    size={22}
                    className={cn(
                      "text-slate-500",
                      pathname?.includes(starterExam.id) && "text-slate-700"
                    )}
                  />
                )}
                <div>{starterExam.title}</div>
              </div>
            </button>
            )}
        {course.chapters.map((chapter,chapterIndex) => {
          let a: ({ id: string; title: string; description: string | null; videoUrl: string | null; position: number; isPublished: boolean; chapterId: string; createdAt: Date; updatedAt: Date; } & { userProgress: { id: string; userId: string; lessonId: string; isCompleted: boolean; createdAt: Date; updatedAt: Date; }[] | null; })[] = []
          let tempLessons = chapter.lessons
          chapter.lessons.map((lesson,index) => {
            let tempLessons = chapter.lessons.slice(0, index + 1) 
            for (let i = 0; i < tempLessons.length; i++) {
              if(index == 0){
                if(chapterIndex == 0){
                  lesson.lock = false
                }
                else{
                  let previousChapter = course.chapters[chapterIndex - 1]
                  
                  for (let i = 0; i < previousChapter.lessons.length; i++) {
                    const element = previousChapter.lessons[i];
                    let userProgressBool = element.userProgress?.some(
                      (progress) =>
                        progress.userId === userId && progress.isCompleted
                    )
                    if(!userProgressBool){
                      lesson.lock = true
                      break
                    }
                  }
                }
              }
              else{
                let userProgressBool = tempLessons[i].userProgress?.some(
                  (progress) =>
                    progress.userId === userId && progress.isCompleted
                )
                if(!userProgressBool && i != index ){
                  lesson.lock = true
                  break
                }
                else{
                  lesson.lock = false
                }

              }
            }
            a.push(lesson)
          })
          return(
            
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              courseId={course.id}
              lessons={a}
              quiz={chapter.quiz}
              exam={exam}
              starterExam={starterExam}
              starterExamProgress={starterExamProgress}
            />
          )
})}
      </div>
      {!takingExamination && !viewingCertificate && !takingQuiz && exam?.id && (
        <div
          className={`mt-auto border-t border-teal-600 bg-teal-100/50 ${
            !hasCertificate && "pt-4"
          } `}
        >
          {!hasCertificate ? (
            progressCount <= 0 ? (
              <div className="px-4 pb-4 text-xs italic">
               يمكنك إجراء اختبارات الدورة قبل بدء الدورة. لك
سيتم مقارنة النتيجة مع المخبر الذي تقوم به عندما تأخذ
الامتحانات في نهاية الدورة ويمكنك تتبع الخاص بك
تحسين. سيتم منحك تقدمًا بنسبة 10 بالمائة إذا قمت بذلك
الإجابة على أكثر من 50% من السؤال بشكل صحيح
              </div>
            ) : progressCount === 100 ? (
              <div className="px-4 pb-4 text-xs italic">
                لقد انتهيت من الدورة{" "}
                <span className={cn(!exam?.id && "hidden")}>
                يرجى إجراء الامتحان. سوف تحصل على شهادة!
                </span>
              </div>
            ) : (
              <div className="px-4 pb-4 text-xs italic">
                هناك امتحان في نهاية الدورة يقدم شهادة، ولكن
                عليك أن تأخذ الدورة لتأخذها. استمر بالتسلق!
              </div>
            )
          ) : null}
          {exam?.id ? (
            examCompleted?.isCompleted == true && hasCertificate ? (
              <Link
                href={`/courses/${course.id}/exam/${exam.id}/certificate/${certificateId.id}`}
                prefetch={false}
                className={cn(
                  "flex items-center text-right gap-x-2 px-4 bg-emerald-500/20 text-emerald-500 text-sm font-[500] py-4 transition-all hover:text-emerald-600 hover:bg-emerald-500/20"
                )}
              >
                انظر شهادتك{" "}
                <ArrowRight
                  className={cn(
                    "ml-4 text-slate-500",
                    progressCount === 100 && "text-emerald-500"
                  )}
                />
              </Link>
            ) : (
              <Link
                href={`/courses/${course.id}/exam/${exam.id}`}
                prefetch={false}
                className={cn(
                  "flex items-center text-right gap-x-2 px-4 bg-slate-500/20 text-slate-500 text-sm font-[500] py-4 transition-all hover:text-slate-600 hover:bg-slate-500/20",
                  progressCount > 0 && progressCount < 100
                    ? "cursor-not-allowed"
                    : "animate-pulse text-emerald-500 bg-emerald-500/20 hover:text-emerald-600 hover:bg-emerald-600/20"
                )}
              >
                خذ امتحان الدورة؟{" "}
                <ArrowRight
                  className={cn(
                    "ml-4 text-slate-500",
                    progressCount === 100 && "text-emerald-500"
                  )}
                />
              </Link>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};
