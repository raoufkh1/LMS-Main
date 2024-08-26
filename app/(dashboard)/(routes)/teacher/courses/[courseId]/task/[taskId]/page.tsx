import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";


import { TaskTitleForm } from "./_components/task-title-form";
import { TaskContentForm } from "./_components/task-content-form";
import { TaskActions } from "./_components/task-actions";

const TaskPage = async ({
  params,
}: {
  params: { taskId: string; courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const task = await db.task.findUnique({
    where: {
      id: params.taskId,
      courseId: params.courseId,
    },
  });

  if (!task) {
    return redirect("/");
  }

  const requiredFields = [task.title, task.content];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!task.isPublished && (
        <Banner
          variant="warning"
          label="هذه المهمة غير منشورة لن تكون مرئية في الدورة"
        />
      )}
      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة إلى إعداد الكورس
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">إنشاء المهمة</h1>
                <span className="text-sm text-slate-700">
                أكمل كافة الحقول {completionText} - يجب أن يكون لديك
                  وصف 
                </span>
              </div>
              <TaskActions
                disabled={!isComplete}
                courseId={params.courseId}
                taskId={params.taskId}
                isPublished={task.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">تخصيص المهمة الخاصة بك</h2>
              </div>
              <TaskTitleForm
                initialData={task}
                courseId={params.courseId}
                taskId={params.taskId}
              />
              <TaskContentForm
                initialData={task}
                courseId={params.courseId}
                taskId={params.taskId}
              />
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default TaskPage;
