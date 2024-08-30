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
      include: {
        chapters: {
          where: {
            id: chapterId,
            isPublished: true
          },
          include: {
            lessons: {
              where: {
                id: lessonId,
                isPublished:true
              }
            }
          }
        },
        attachments: {
          where: {
            courseId
          }
        }
      }
    });
    console.log(course?.chapters)
    const chapter = course?.chapters[0]

    const lesson = chapter?.lessons[0]

    if (!chapter || !course || !lesson) {
      throw new Error("Chapter or course not found");
    }

    let attachments: Attachment[] = [];
    let nextLesson: Lesson | null = null;
    let nextChapter: (Chapter & { lessons: Lesson[] }) | null = null;

    attachments = course.attachments

    

    

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
