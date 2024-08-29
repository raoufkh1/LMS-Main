"use client";

import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { number } from "zod";

interface TaskCompeleteButtonProps {

  courseId: string;
  taskId: string;
  isCompleted?: boolean;

}

export const TaskCompeleteButton = ({
  courseId,
  taskId,
  isCompleted,
  
}: TaskCompeleteButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(
        `/api/courses/${courseId}/task/${taskId}/progress`,
        {
          isCompleted: !isCompleted,
          
        }
      );

      

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
