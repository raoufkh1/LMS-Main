import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  ClipboardListIcon,
  File,
  LayoutDashboard,
  ListChecks,
  ShieldQuestion,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { AttachmentForm } from "./_components/attachment-form";
import { ChaptersForm } from "./_components/chapters-form";
import { Actions } from "./_components/actions";
import { ExamForm } from "./_components/exam-form";
import { StarterExamForm } from "./_components/exam-starter-form";
import { TaskForm } from "./_components/task-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      exams: true,
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const task = await db.task.findFirst({
    where:{
      courseId: params.courseId
    }
  })
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banner label=".هذه الدورة غير منشورة. ولن تكون مرئية للطلاب" />
      )}
      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">إعداد الدورة</h1>
            <span className="text-sm text-slate-700">
            أكمل كافة الحقول {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">تخصيص الدورة التدريبية الخاصة بك</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">فصول الدورة</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ShieldQuestion} />
                <h2 className="text-xl">الاختبار القبلي  </h2>
              </div>
              <StarterExamForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ShieldQuestion} />
                <h2 className="text-xl">الاختبار البعدي  </h2>
              </div>
              <ExamForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ClipboardListIcon} />
                <h2 className="text-xl"> المهام  </h2>
              </div>
              <TaskForm initialData={task} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
