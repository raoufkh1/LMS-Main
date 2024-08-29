import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { TaskForm } from "./_components/task-form";
import { db } from "@/lib/db";
import { FileUpload } from "@/components/file-upload";
import { TaskFileForm } from "./_components/task-file-form";
import { isTeacher } from "@/lib/teacher";
import TaskTeacherFiles from "./_components/task-files-teacher";
import { TaskCompeleteButton } from "./_components/task-complete-button";



const LessonIdPage = async ({
  params,
}: {
  params: { courseId: string; taskId: string; };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const task = await db.task.findUnique({where:{id:params.taskId}})
  const attachmentTask = await db.taskAttachment.findFirst({
    where:{
      taskId:params.taskId,
      userId: userId
    }
  })
  if (!task) {
    return redirect("/");
  }
  const taskProgress = await db.userProgress.findFirst({where: {lessonId : params.taskId, userId:userId}})
  const completeOnEnd = taskProgress?.isCompleted
  console.log(taskProgress)
  const startedAt = Date.now()
  return (
    <div>
      {completeOnEnd && (
        <Banner variant="success" label=".لقد أكملت هذه المهمة بالفعل" />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20 pt-10" dir="rtl">
      <div className="flex ">
              
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
              <h2 className="text-2xl font-semibold">{task?.title}</h2>
              <TaskCompeleteButton taskId={task.id} isCompleted={taskProgress?.isCompleted} courseId={params.courseId}/>
          </div>
        <div className="space-y-4">
          
          <Separator />
          
            <div dir="rtl">
              <TaskForm defaultContext={task?.content!} />
            </div>
              
           {
            isTeacher(userId) ? (<TaskTeacherFiles taskId={params.taskId} courseId={params.courseId}/>) : (<TaskFileForm taskId={params.taskId} courseId={params.courseId} attachment={attachmentTask!}/>)
           }
            
        </div>
        
      </div>
    </div>
  );
};

export default LessonIdPage;
