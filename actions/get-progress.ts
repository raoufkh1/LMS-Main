import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
        quiz: {
          where: {
            isPublished: true,
          },
          select: {
            userId: true,
          },
        },
        lessons: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
    });

    const publishedLessonIds = publishedChapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => lesson.id)
    );
    const exams = await db.exam.findMany({
      where: {
        courseId,
        isPublished: true
      }
    })
    const examsIds = exams.map((exam) => exam.id)
    const examsCompeleted = await db.userProgress.count({
      where:{
        userId,
        lessonId: {
          in:examsIds
        }
      }
    })
    const publishedQuizIds = publishedChapters.filter(
      chapter => chapter.quiz?.userId != 'nil' && chapter.quiz != null
    )
    console.log(publishedQuizIds)

    const validCompletedLessons = await db.userProgress.count({
      where: {
        userId: userId,
        lessonId: {
          in: publishedLessonIds,
        },
        isCompleted: true,
      },
    });

    const validCompletedQuizes = await db.userQuizPoints.count({
      where: {
        userId: userId,
        AND: {
          quiz: {
            chapter: {
              courseId: courseId,
            },
          },
        },
      },
    });
    const examsProgress = examsCompeleted * 10
    const completedItems = validCompletedLessons + validCompletedQuizes;
    const totalItems = publishedLessonIds.length + publishedQuizIds.length;
    const progressPercentage = (completedItems / totalItems) * (100 - exams.length * 10) + examsProgress;
    console.log(progressPercentage + " %")
    
    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
