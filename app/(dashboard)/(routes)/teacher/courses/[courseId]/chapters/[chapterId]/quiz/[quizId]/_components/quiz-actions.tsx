"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface QuizActionsProps {
  disabled: boolean;
  chapterId: string;
  courseId: string;
  quizId: string;
  isPublished: boolean;
}

export const QuizActions = ({
  disabled,
  chapterId,
  courseId,
  quizId,
  isPublished,
}: QuizActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/unpublish`
        );
        toast.success("تم إلغاء نشر النشاط");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/quiz/${quizId}/publish`
        );
        toast.success("تم نشر النشاط");
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

      await axios.delete(`/api/courses/${chapterId}/quiz/${quizId}`);

      toast.success("تم حذف الاختبار");
      router.refresh();
      router.push(`/teacher/courses/${chapterId}`);
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
