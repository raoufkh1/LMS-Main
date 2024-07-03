import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { VideoPlayer } from "./_components/video-player";
import { CourseProgressButton } from "./_components/course-progress-button";
import { CourseEditButton } from "./_components/course-introduction-edit";
import { isTeacher } from "@/lib/teacher";

const LessonIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string; lessonId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    lesson,
    chapter,
    course,
    attachments,
    nextLesson,
    nextChapter,
    userProgress,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
    lessonId: params.lessonId,
  });

  if (!chapter || !course || !lesson) {
    return redirect("/");
  }
  const isInroductionCourse = process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID === course.id
  const completeOnEnd = !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label=".لقد أكملت هذا الدرس بالفعل" />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20 pt-10" dir="rtl">
      <div className="flex ">
              
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold">{lesson.title}</h2>
            {
              isInroductionCourse ?  isTeacher(userId) ?  <CourseEditButton /> : "" : (
                <CourseProgressButton
                  lessonId={params.lessonId}
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextLessonId={nextLesson?.id}
                  nextChapterId={nextChapter?.id}
                  nextChapterFirstLessonId={nextChapter?.lessons.sort((a, b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))[0].id}
                  isCompleted={!!userProgress?.isCompleted}
                />

              ) 
            }
          </div>
        <div className="space-y-4">
          
          <Separator />
          {
            !isInroductionCourse && (
            <div dir="rtl">
              <div  className="text-lg text-slate-700 px-4">وصف الدرس</div>
              <Preview value={lesson.description!} />
            </div>
              
            )
          }
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex space-x-2 items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <div className="line-clamp-1">{attachment.name}</div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
        {lesson.videoUrl && (
          <div className="p-4">
            <VideoPlayer
              chapterId={params.chapterId}
              title={chapter.title}
              lessonId={lesson.id}
              courseId={params.courseId}
              nextLessonId={nextLesson?.id}
              nextChapterId={nextChapter?.id}
              nextChapterFirstLessonId={nextChapter?.lessons[0].id}
              completeOnEnd={completeOnEnd}
              url={lesson.videoUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonIdPage;
