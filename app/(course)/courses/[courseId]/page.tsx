
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  const course:any = await db.course.findUnique({
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
  const StartExamProgress:any = await db.exam.findMany({
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
  const StartExam:any = await db.exam.findMany({
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
  if(StartExamProgress.length > 0){
    console.log("````````````````")
  }
  else{
    console.log("-=================================================")
    console.log(StartExam)
    return redirect(
      `/courses/${StartExam[0].courseId}/exam/${StartExam[0].id}/`
    );
  }
  // const StartExam = course.exams.filter((e:any) => e.starterExam == true)
  console.log("StartExam")
  console.log(StartExamProgress)
  
  return redirect(
    `/courses/${course.id}/chapters/${course.chapters[0].id}/lessons/${course.chapters[0].lessons[0].id}`
  );
};

export default CourseIdPage;
