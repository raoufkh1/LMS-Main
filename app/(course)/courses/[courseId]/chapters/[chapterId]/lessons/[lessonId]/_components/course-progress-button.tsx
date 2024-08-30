"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { number } from "zod";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  lessonId: string;
  isCompleted?: boolean;
  userId: string;
  startedAt: number
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  lessonId,
  isCompleted,
  userId,
  startedAt
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/progress`,
        {
          isCompleted: !isCompleted,
          userId: userId,
          startedAt: startedAt
        }
      );

      if (!isCompleted) {
        router.push(
          `/courses/${courseId}`
        );
      }

      if (!isCompleted) {
        router.push(
          `/courses/${courseId}`
        );
      }

      if (!isCompleted) {
        router.push(
          `/courses/${courseId}/`
        );
      }

      toast.success("تم تحديث التقدم");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto bg-sky-700 hover:bg-sky-600"
    >
      {isCompleted ? "غير مكتمل" : "وضع علامة كمكتملة"}
      <Icon className="h-4 w-4 mr-2" />
    </Button>
  );
};
