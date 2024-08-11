"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ExamQuestion, ExamQuestionOption } from "@prisma/client";

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

import { OptionList } from "./option-list";

interface OptionFormProps {
  initialData: ExamQuestion & { options: ExamQuestionOption[] };
  courseId: string;
  examId: string;
  questionId: string;
}

const formSchema = z.object({
  text: z.string().min(1),
});

export const OptionForm = ({
  initialData,
  examId,
  courseId,
  questionId,
}: OptionFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [optionToBeEdited, setOptionToBeEdited] =
    useState<ExamQuestionOption>();

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const hasReachedMaxOptions = initialData.options.length === 4;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}/options`,
        values
      );
      toast.success("تم إنشاء خيار السؤال");
      toggleCreating();
      form.setValue("text", "");
      router.refresh();
    } catch (error: any) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      toast.error(error.response.data);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(
        `/api/courses/${courseId}/exam/${examId}/questions/${questionId}/options/reorder`,
        {
          list: updateData,
        }
      );
      toast.success("تمت إعادة ترتيب خيارات الأسئلة");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (option: ExamQuestionOption) => {
    setOptionToBeEdited(option);
    // router.push(`/teacher/courses/${courseId}/exam/${examId}/questions/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        <div>
          <div> خيارات السؤال</div>
          <div className="text-xs font-semibold">الحد الأدنى 2 والحد الأقصى 4</div>
        </div>
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>إلغاء</>
          ) : hasReachedMaxOptions ? null : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              إضافة خيار
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
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نص الخيار</FormLabel>
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
            !initialData.options.length && "text-slate-500 italic"
          )}
        >
          {!initialData.options.length && "لا يوجد خيارات"}
          <OptionList
            answer={initialData.answer}
            courseId={courseId}
            examId={examId}
            questionId={questionId}
            onReorder={onReorder}
            items={initialData.options || []}
          />
        </div>
      )}
      {!isCreating && (
        <div className="text-xs text-muted-foreground mt-4">
          قم بالسحب والإسقاط لإعادة ترتيب الخيارات
        </div>
      )}
    </div>
  );
};
