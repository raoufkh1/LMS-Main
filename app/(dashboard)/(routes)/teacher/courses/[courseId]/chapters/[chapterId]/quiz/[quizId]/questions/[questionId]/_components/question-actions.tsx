"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface QuestionActionsProps {
  disabled: boolean;
  courseId: string;
  quizId: string;
  chapterId: string;
  questionId: string;
  isPublished: boolean;
}

export const QuestionActions = ({
  disabled,
  courseId,
  quizId,
  questionId,
  isPublished,
  chapterId,
}: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/questions/${questionId}/unpublish`
        );
        toast.success("سؤال غير منشور");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/questions/${questionId}/publish`
        );
        toast.success("تم نشر السؤال");
      }

      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/questions/${questionId}`
      );

      toast.success("تم حذف السؤال");
      router.push(
        `/teacher/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}`
      );
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "إلغاء النشر" : "نشر"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
