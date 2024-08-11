"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Exam } from "@prisma/client";
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { ClassicEditor, ImageUpload, Alignment, ImageInsert, Bold, Essentials, Italic, Mention, CloudServices, Paragraph, TextPartLanguage, Undo, Base64UploadAdapter, Heading, FontFamily, FontSize, FontColor, FontBackgroundColor, Strikethrough, Subscript, Superscript, Link, UploadImageCommand, Image, BlockQuote, CodeBlock, TodoList, OutdentCodeBlockCommand, Indent } from 'ckeditor5';
import { ImportWord, ImportWordEditing } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";

interface ExamDescriptionFormProps {
  initialData: Exam;
  courseId: string;
  examId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const ExamDescriptionForm = ({
  initialData,
  courseId,
  examId,
}: ExamDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/exam/${examId}`, values);
      toast.success("تم تحديث الامتحان");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
      وصف الامتحان
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>إلغاء</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              تحرير الوصف
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {!initialData.description && "بدون وصف"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <CKEditor
                      editor={ClassicEditor}
                      onChange={(e, editor) => {
                        const data = editor.data.get()
                        form.setValue("description",data)
                      }}
                      config={{
                        language: {
                          content: 'ar',
                          ui: "ar"
                        },
                        plugins: [Undo, Heading, FontFamily,
                          FontSize, FontColor, FontBackgroundColor, Bold, Italic, Strikethrough, Subscript, Superscript,
                          Link, Image, ImageInsert, ImageUpload, Alignment, BlockQuote, CloudServices, Base64UploadAdapter, CodeBlock, TodoList, Indent, ImportWord],
                        toolbar: {
                          items: [
                            'undo', 'redo',
                            '|',
                            'heading',
                            '|',
                            'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor',
                            '|',
                            'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                            '|',
                            'link', 'uploadImage', 'blockQuote', 'codeBlock',
                            '|',
                            'bulletedList','Alignment', 'numberedList', 'todoList', 'outdent', 'indent'
                          ],
                          shouldNotGroupWhenFull: false
                        },

                        licenseKey: 'bE0wYlJQa085OGNKM002ZlliYW9WUjVaOWptVXpadWJHaUJ1WThxUmFlZVoyS0JTb2cwNXhQMUw4YSs3TlE9PS1NakF5TkRBNU1Eaz0=',
                        

                        initialData: form.getValues("description"),

                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
