"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ExamActionsProps {
  disabled: boolean;
  courseId: string;
  examId: string;
  isPublished: boolean;
}

export const ExamActions = ({
  disabled,
  courseId,
  examId,
  isPublished,
}: ExamActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/exam/${examId}/unpublish`);
        toast.success("الامتحان غير منشور");
      } else {
        await axios.patch(`/api/courses/${courseId}/exam/${examId}/publish`);
        toast.success("تم نشر الامتحان");
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

      await axios.delete(`/api/courses/${courseId}/exam/${examId}`);

      toast.success("تم حذف الفصل");
      router.push(`/teacher/courses/${courseId}`);
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
