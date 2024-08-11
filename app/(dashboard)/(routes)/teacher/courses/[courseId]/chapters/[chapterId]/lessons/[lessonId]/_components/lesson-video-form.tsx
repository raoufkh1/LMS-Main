"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import ReactPlayer from "react-player";

interface LessonVideoFormProps {
  initialData: Lesson;
  courseId: string;
  chapterId: string;
  lessonId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const LessonVideoForm = ({
  initialData,
  courseId,
  chapterId,
  lessonId,
}: LessonVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
        values
      );
      toast.success("تم تحديث الدرس");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 max-h-full rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
      فيديو الدرس
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>إلغاء</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              أضف فيديو
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              تحرير الفيديو
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer
              height={"100%"}
              width={"100%"}
              className="h-full"
              url={initialData.videoUrl}
              playing={false}
              controls={true}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="lessonVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />

          <div className="text-xs text-muted-foreground mt-4">
          قم بتحميل فيديو هذا الدرس
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          يمكن أن تستغرق معالجة مقاطع الفيديو بضع دقائق. قم بتحديث الصفحة إذا كان الفيديو
          لا تظهر.
        </div>
      )}
    </div>
  );
};
