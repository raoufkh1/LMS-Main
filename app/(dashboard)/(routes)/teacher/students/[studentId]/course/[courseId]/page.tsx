import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";

import { db } from "@/lib/db";
import TaskTeacherFiles from "./taskAttachemet";




const LessonIdPage = async ({
  params,
}: {
  params: { studentId: string; courseId: string; };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  let user = await clerkClient.users.getUser(params.studentId)
  const task = await db.task.findFirst({
    where: {
        courseId: params.courseId
    }
  })
  const taskAttachemet = await db.taskAttachment.findFirst({
    where:{
        userId: params.studentId,
        taskId: task?.id
    }
  })
  user = JSON.parse(JSON.stringify(user))
  console.log("Task" , taskAttachemet )
  console.log("User" ,user)
  return (
    <div>
      
      <div className="flex flex-col max-w-4xl mx-auto pb-20 pt-10" dir="rtl">
      <div className="flex ">
              
        </div>
        
          
          
            
              
            <TaskTeacherFiles attachment={taskAttachemet!} user={user}/>           
            
        </div>
        
      </div>
    
  );
};

export default LessonIdPage;
