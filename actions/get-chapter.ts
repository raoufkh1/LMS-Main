import { db } from "@/lib/db";
import { Attachment, Chapter, Lesson } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
  lessonId,
}: GetChapterProps) => {
  try {
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        isPublished: true,
      },
    });

    if (!chapter || !course || !lesson) {
      throw new Error("Chapter or course not found");
    }

    let attachments: Attachment[] = [];
    let nextLesson: Lesson | null = null;
    let nextChapter: (Chapter & { lessons: Lesson[] }) | null = null;

    attachments = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    });

    nextLesson = await db.lesson.findFirst({
      where: {
        chapterId: chapterId,
        isPublished: true,
        position: {
          gt: lesson?.position,
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      include: {
        lessons: true,
      },
      orderBy: {
        position: "asc",
      },
    });

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return {
      chapter,
      lesson,
      course,
      attachments,
      nextLesson,
      nextChapter,
      userProgress,
    };
  } catch (error) {
    console.log("[GET_CHAPTER]", error);
    return {
      lesson: null,
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextLesson: null,
      userProgress: null,
    };
  }
};
