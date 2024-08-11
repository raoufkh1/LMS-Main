"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface LessonActionsProps {
  disabled: boolean;
  courseId: string;
  taskId: string;
  isPublished: boolean;
}

export const TaskActions = ({
  disabled,
  courseId,
  taskId,
  isPublished,
}: LessonActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/task/${taskId}/unpublish`
        );
        toast.success("المهمة غير منشورة");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/task/${taskId}/publish`
        );
        toast.success("تم نشر المهمة");
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
        `/api/courses/${courseId}/task/${taskId}`
      );

      toast.success("تم حذف المهمة");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
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
