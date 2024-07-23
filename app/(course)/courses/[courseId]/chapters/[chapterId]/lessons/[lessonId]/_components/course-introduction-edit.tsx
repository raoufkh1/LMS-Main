"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  lessonId: string;
  isCompleted?: boolean;
  nextLessonId?: string;
  nextChapterId?: string;
  nextChapterFirstLessonId?: string;
}

export const CourseEditButton = ({chapterId, lessonId} : {chapterId:string, lessonId:string}) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    router.push(`/teacher/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}/chapters/${chapterId}/lessons/${lessonId}`)
  };

  

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      
      type="button"
      variant={"success"}
      className="w-full md:w-auto bg-sky-700 hover:bg-sky-600"
    >
      { " تعديل" }
      
    </Button>
  );
};
