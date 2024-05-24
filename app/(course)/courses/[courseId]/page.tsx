
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

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
  const StartExam = await db.exam.findMany({
    where: {
      courseId: params.courseId,
      userId: userId,
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
  console.log("StartExam")
  console.log(StartExam)
  if(StartExam[0]!.beforeScore < StartExam[0]?.passingScore){
    return redirect(`/courses/${StartExam[0].courseId}/exam/${StartExam[0].id}`)

  }
  return redirect(
    `/courses/${course.id}/chapters/${course.chapters[0].id}/lessons/${course.chapters[0].lessons[0].id}`
  );
};

export default CourseIdPage;
