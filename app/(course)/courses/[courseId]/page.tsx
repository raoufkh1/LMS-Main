
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId }: { userId: any } = auth();

  const course = await db.course.findUnique({
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
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }
  const task = await db.task.findFirst({
    where: {
      courseId: course.id,
      isPublished: true,

    }
  })
  const StartExam = await db.exam.findFirst({
    where: {
      courseId: params.courseId,
      starterExam: true
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
  const StartExamProgress: any = await db.userProgress.findFirst({
    where: {
      lessonId: StartExam?.id,
      userId: userId
    },

  });
  if (StartExam) {
    if (StartExam.isPublished) {
      if (StartExamProgress?.isCompleted) {

      }
      else {
        redirect(
          `/courses/${course.id}/exam/${StartExam?.id}`
        )
      }

    }

  }
  // const StartExam = course.exams.filter((e:any) => e.starterExam == true)
  let currentLesson
  let currentChapter
  let currentQuiz
  for (let i = 0; i < course.chapters.length; i++) {
    const chapter = course.chapters[i];
    const quiz = await db.quiz.findFirst({
      where: {
        chapterId: chapter.id
      }
    })
    for (let j = 0; j < chapter.lessons.length; j++) {
      const lesson = chapter.lessons[j];
      const progress = await db.userProgress.findFirst({ where: { lessonId: lesson.id, userId: userId } })
      if (progress?.isCompleted) {

      }
      else {
        currentLesson = lesson
        currentChapter = chapter
        break
      }
    }
    if (currentLesson) {
      break
    }
    if (quiz) {
      const quizPoints = await db.userQuizPoints.findFirst({
        where: {
          userId: userId,
          quizId: quiz.id
        }
      })
      if (quiz.isPublished) {
        if (quizPoints) {

        }
        else {
          currentChapter = chapter
          currentQuiz = quiz
          break
        }

      }
    }

  }
  if (currentChapter && currentLesson) {

    return redirect(
      `/courses/${course.id}/chapters/${currentChapter?.id}/lessons/${currentLesson?.id}`
    );
  }
  else if (currentChapter && currentQuiz) {
    return redirect(
      `/courses/${course.id}/chapters/${currentChapter?.id}/quiz/${currentQuiz?.id}`
    );
  }
  else {
    const taskStatus = await db.userProgress.findFirst({
      where: {
        lessonId: task?.id,
        userId
      }
    })
    if (!taskStatus?.isCompleted) {
      return redirect(
        `/courses/${course.id}/task/${task?.id}/`
      );
      
    }
    else{
      const finalExam = await db.exam.findFirst({
        where: {
          courseId: params.courseId,
          starterExam: false
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
      if (finalExam?.isPublished) {

        return redirect(`/courses/${course.id}/exam/${finalExam?.id}`)
      }
      else {
        return redirect(
          `/courses/${course.id}/chapters/${course.chapters[0].id}/lessons/${course.chapters[0].lessons[0].id}`
        );
      }
    }

  }
};

export default CourseIdPage;
