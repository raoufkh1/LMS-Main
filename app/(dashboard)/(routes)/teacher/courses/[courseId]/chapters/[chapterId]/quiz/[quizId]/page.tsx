import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";

import { QuizTitleForm } from "./_components/quiz-title-form";
import { QuizDescriptionForm } from "./_components/quiz-description-form";
import { QuizActions } from "./_components/quiz-actions";
import { QuestionForm } from "./_components/question-form";
import { FaQuestion } from "react-icons/fa";

const QuizIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string; quizId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const quiz = await db.quiz.findUnique({
    where: {
      id: params.quizId,
      chapterId: params.chapterId,
    },
    include: {
      questions: true,
    },
  });

  if (!quiz) {
    return redirect("/");
  }

  const requiredFields = [
    quiz.title,
    quiz.questions.some((question) => question.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!quiz.isPublished && (
        <Banner
          variant="warning"
          label="هذا الاختبار غير منشور. لن يكون مرئيا في الدورة"
        />
      )}
      <div className="p-6" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة إلى إعداد الفصل
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">إنشاء مسابقة</h1>
                <span className="text-sm text-slate-700">
                أكمل كافة الحقول {completionText}
                </span>
              </div>
              <QuizActions
                disabled={!isComplete}
                chapterId={params.chapterId}
                courseId={params.courseId}
                quizId={params.quizId}
                isPublished={quiz.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">تخصيص النشاط الخاص بك</h2>
              </div>
              <QuizTitleForm
                initialData={quiz}
                chapterId={params.chapterId}
                courseId={params.courseId}
                quizId={params.quizId}
              />
              
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={FaQuestion} />
              <h2 className="text-xl">أضف أسئلة</h2>
            </div>
            <QuestionForm
              initialData={quiz}
              quizId={quiz.id}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizIdPage;
