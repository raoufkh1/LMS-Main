"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Delete, Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, Exam } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@radix-ui/react-label";

interface ExamFormProps {
  initialData: any;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export const TaskForm = ({ initialData, courseId }: ExamFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/task`,
        values
      );
      toast.success("تم إنشاء المهمة");

      toggleCreating();

      router.refresh();
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      toast.error("هناك شئ غير صحيح");
    }
  };
  const task = initialData
  const onEdit = (id: string | undefined) => {
    router.push(`/teacher/courses/${courseId}/task/${id}`);
  };
  const onDelete = async (id: string | undefined) => {
    try {
      //  setIsDeleting(true);
      debugger

      await axios.delete(
        `/api/courses/${courseId}/task/${id}`
      );
      //deleted(id)
      toast.success("تم حذف الخيار");
      router.refresh();
    } catch {
      toast.success("تم حذف الخيار");
      router.refresh();

    } finally {
      //  setIsDeleting(false);
    }
  };
  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        مهام الدورة
        {!(task) && (
          <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
              <>إلغاء</>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                إضافة مهمة
              </>
            )}
          </Button>
        )}
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <Label>-:عنوان</Label>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>

                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'امتحان تطوير الويب"
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
            !task && "text-slate-500 italic"
          )}
        >
          {
              !task ? (
                "لا توجد مهمة"
              ) : (
                <div
                  className={cn(
                    "flex justify-between items-center py-3 pl-3 gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm"
                  )}
                >
                  <div> {task.title}</div>
                  <div className="ml-auto pr-2 flex items-center gap-x-2">
                    <Badge
                      className={cn(
                        "bg-slate-500",
                        task.isPublished && "bg-sky-700"
                      )}
                    >
                      {task.isPublished ? "نشرت" : "مسودة"}
                    </Badge>
                    <Delete
                      onClick={() => onDelete(task.id)}
                      className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                    />
                    {

                      <Pencil
                        onClick={() => onEdit(task.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    }
                  </div>
                </div>
              )
            
          
          }
        </div>
      )}
    </div>
  );
};
