import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  progress: number | null;
  category: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div dir="rtl" className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <div className="text-xs text-muted-foreground">{category}</div>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength > 2 ? chaptersLength : ''} 
                {chaptersLength === 1 ? "فصل" : ""}
                {chaptersLength === 2 ? " فصلين " : ""}
                {chaptersLength > 2 ? " فصول " : ""}
                {chaptersLength > 10 ? " فصل " : ""}
              </span>
            </div>
          </div>
          {progress !== null && Math.round(progress) > 0 ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <div className="w-full flex justify-between items-center">
              <div className="font-medium text-sm text-sky-700">ابدأ الدورة</div>
              <ArrowRight className="h-4 w-4 mr-2 text-sky-700" />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
