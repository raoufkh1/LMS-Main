
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId }:{userId:any}= auth();

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
  const StartExamProgress:any = await db.userProgress.findFirst({
    where: {
      lessonId: StartExam?.id,
      userId: userId
    },
    
  });
  if(StartExamProgress?.isCompleted){

  }
  else{
    redirect(
      `/courses/${course.id}/exam/${StartExam?.id}`
    )
  }
  // const StartExam = course.exams.filter((e:any) => e.starterExam == true)
  
  
  return redirect(
    `/courses/${course.id}/chapters/${course.chapters[0].id}/lessons/${course.chapters[0].lessons[0].id}`
  );
};

export default CourseIdPage;
