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
import { ArrowRight, CheckCircle, LockIcon, PlayCircle } from "lucide-react";
import { headers } from "next/headers";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[] | null;
        lock: Boolean
      })[];
      quiz: (Quiz & { userQuizPoints: UserQuizPoints[] | null, lock : boolean }) | null;
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

  const pathname = headersList.get("referer") || "";
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
  console.log()
  console.log(starterExamProgress)
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
  const hasCertificate = certificateId != undefined;
  const examCompleted = await db.userProgress.findFirst({
    where:{
      lessonId:exam?.id,
      userId:userId
    }
  })
  const handleLessonClick = (examId: string) => {
    console.log("s")
  
      redirect(`/courses/${course.id}/exam/${examId}`)
    };
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
                `flex items-center ${pathname.includes(starterExamProgress?.lessonId || "") ? "text-red-700" : ""} justify-end w-full gap-x-2 text-slate-600 text-sm font-[500] transition-all px-4 hover:text-slate-700 hover:bg-gray-300 border-r-4 border-opacity-0 hover:border-opacity-95 border-gray-600 h-full`,
                
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
              if(!starterExamProgress?.isCompleted){
                lesson.lock = true
              }
              else if(index == 0){
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
          for(let i = 0; i < chapter.lessons.length; i++){
            const element = chapter.lessons[i];
                    let userProgressBool = element.userProgress?.some(
                      (progress) =>
                        progress.userId === userId && progress.isCompleted
                    )
            if(!userProgressBool){
              if(chapter.quiz){
                chapter.quiz!.lock = true
                break

              }
            }
          }
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
      <div>
        { exam?.id && (
                <Link
                type="button"
                href={(progressCount == 100) ?`/courses/${course.id}/exam/${exam.id}` : "#"}
                className={cn(
                  `flex items-center ${pathname.includes(starterExamProgress?.lessonId || "") ? "text-red-700" : ""} justify-end w-full gap-x-2 text-slate-600 text-sm font-[500] transition-all px-4 hover:text-slate-700 hover:bg-gray-300 border-r-4 border-opacity-0 hover:border-opacity-95 border-gray-600 h-full`,
                  
                )}
              >
                <div className="flex items-center justify-between text-right w-full gap-x-2 py-4">
                  {!(progressCount == 100) ? (
                    <LockIcon
                      size={22}
                      className={cn(
                        "text-gray-700",
                        pathname?.includes(exam.id) && "text-gray-800"
                      )}
                    />
                  ) : !examCompleted?.isCompleted ? <PlayCircle
                  size={22}
                  className={cn(
                    "text-slate-500",
                    pathname?.includes(exam.id) && "text-slate-700"
                  )}
                /> : (
                    <CheckCircle
                      size={22}
                      className={cn(
                        "text-slate-500",
                        pathname?.includes(exam.id) && "text-slate-700"
                      )}
                    />
                  )}
                  <div>{exam.title}</div>
                </div>
              </Link>
              )}

      </div>
    </div>
  );
};
