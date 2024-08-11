"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Exam, ExamQuestion } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

import { QuestionList } from "./question-list";

interface QuestionFormProps {
  initialData: Exam & { questions: ExamQuestion[] };
  courseId: string;
  examId: string;
}

const formSchema = z.object({
  prompt: z.string().min(1),
});

export const QuestionForm = ({
  initialData,
  examId,
  courseId,
}: QuestionFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/exam/${examId}/questions`,
        values
      );
      toast.success("تم إنشاء السؤال");
      toggleCreating();
      form.setValue("prompt", "");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };

  const onDelete = async (id: string) => {
    try {
       setIsDeleting(true);
      debugger
      
      await axios.delete(
        `/api/courses/${courseId}/exam/${examId}/questions/${id}`
      );
      //deleted(id)
      toast.success("تم حذف الخيار");
      router.refresh();
    } catch {
      toast.success("تم حذف الخيار");
      router.refresh();

    } finally {
     setIsDeleting(false);
    }
  };
  
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      var data = updateData;
      await axios.put(
        `/api/courses/${courseId}/exam/${examId}/questions/reorder`,
        {
          list: data,
        }
      );
      toast.success("أعيد ترتيب الأسئلة");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/exam/${examId}/questions/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
      اسئلة الامتحان  
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>إلغاء</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              أضف سؤالا
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان السؤال</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. '...ما هو'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting} type="submit">
              إنشاء
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.questions.length && "text-slate-500 italic"
          )}
        >
          {!initialData.questions.length && "لا توجد أسئلة"}
          <QuestionList
            onEdit={onEdit}
            onReorder={onReorder}
            OnDelete={onDelete}
            items={initialData.questions || []}
          />
        </div>
      )}
      {!isCreating && (
        <div className="text-xs text-muted-foreground mt-4">
          قم بالسحب والإسقاط لإعادة ترتيب الأسئلة
        </div>
      )}
    </div>
  );
};
