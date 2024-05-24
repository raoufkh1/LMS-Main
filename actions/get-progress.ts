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
    
    const publishedQuizIds = publishedChapters.filter(
      chapter => chapter.quiz?.userId != 'nil' && chapter.quiz != null
    )
    console.log(publishedQuizIds)
    console.log("sasd")

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
    
    const completedItems = validCompletedLessons + validCompletedQuizes;
    const totalItems = publishedLessonIds.length + publishedQuizIds.length;
    const progressPercentage = (completedItems / totalItems) * 100;
    
    console.log("Percentage" + progressPercentage)
    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
