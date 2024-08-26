import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File, PlayCircle, Text } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      lessons: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  return redirect(`${params.chapterId}/lessons/${chapter.lessons?.[0].id}`);
};

export default ChapterIdPage;
