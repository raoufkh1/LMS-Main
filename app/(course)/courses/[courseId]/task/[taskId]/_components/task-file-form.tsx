"use client";

import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon, File, Loader2, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course, TaskAttachment } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  attachment?:  TaskAttachment;
  courseId?: string;
  taskId: string
};

const formSchema = z.object({
  url: z.string().min(1),
});

export const TaskFileForm = ({
  attachment,
  courseId,
  taskId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/task/${taskId}/attachment`, values);
      toast.success("تم رفع الملف");
      toggleEdit();
      router.refresh();
    } catch (e) {
      console.log(e)
      toast.error("هناك شئ غير صحيح");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/task/${taskId}/attachment/${id}`);
      toast.success("تم حذف المرفق");
      router.refresh();
    } catch {
      toast.error("هناك شئ غير صحيح");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 px-28 rounded-md py-4">
      
      
      
      {
        attachment ? (<div
          key={attachment.id}
          className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
        >
          <File className="h-4 w-4 mr-2 flex-shrink-0" />
          <div className="text-xs line-clamp-1">
            {attachment.name}
          </div>
          {deletingId === attachment.id && (
            <div>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {deletingId !== attachment.id && (
            <button
              onClick={() => onDelete(attachment.id)}
              className="ml-auto hover:opacity-75 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>) : (<div>
          <FileUpload
            endpoint="taskAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          
        </div>)
      }
        
      
    </div>
  )
}