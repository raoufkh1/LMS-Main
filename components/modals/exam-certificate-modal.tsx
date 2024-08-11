"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface PrepareCertificateModalProps {
  children: React.ReactNode;
  courseId: string;
  examId: string;
  certificateId: string;
}

export const PrepareCertificateModal = ({
  children,
  courseId,
  examId,
  certificateId,
}: PrepareCertificateModalProps) => {
  const formSchema = z.object({
    nameOfStudent: z.string().min(1),
  });

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameOfStudent: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      router.refresh()

      await axios.patch(
        `/api/courses/${courseId}/exam/${examId}/certificate/${certificateId}`,
        value
      );
      toast.success("تم تحديث شهادتك  ");
      router.push(
        `/courses/${courseId}/exam/${examId}/certificate/${certificateId}`
      );
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };
  return (
    <AlertDialog >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>احصل على شهادتك</AlertDialogTitle>
          <AlertDialogDescription>
          املأ الاسم الذي تريده على شهادتك
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="nameOfStudent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="أدخل اسمك الكامل"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2" dir="rtl">
              <Button disabled={!isValid || isSubmitting} type="submit">
                حفظ
              </Button>
            </div>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
