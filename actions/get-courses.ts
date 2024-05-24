import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        AND: [
          {
            chapters: {
              some: {
                isPublished: true,
                AND: {
                  lessons: {
                    some: {
                      isPublished: true,
                    },
                  },
                },
              },
            },
          },
        ],
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        exams: {
          where: {
            userId,
          },
        },
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          let courseProgressPercentage = await getProgress(userId, course.id);
          console.log(courseProgressPercentage)
          // const courseProgressPercentage =
          //   chapterProgressPercentage.reduce((acc, progress) => acc + progress, 0) /
          //   chapterProgressPercentage.length;

          if (
            course.exams[0]?.beforeScore &&
            course.exams[0]?.beforeScore >= 50 &&
            courseProgressPercentage < 100
          ) {
            courseProgressPercentage = Math.min(
              courseProgressPercentage + 10,
              100
            );
          }
          return {
            ...course,
            progress: courseProgressPercentage,
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
};
