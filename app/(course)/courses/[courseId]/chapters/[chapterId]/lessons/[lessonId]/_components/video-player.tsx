"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { LionPlayer } from 'lion-player';
import 'lion-player/dist/lion-skin.min.css';

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { sources } from "next/dist/compiled/webpack/webpack";

interface VideoPlayerProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  completeOnEnd: boolean;
  title: string;
  url: string | null;
}

export const VideoPlayer = ({
  courseId,
  chapterId,
  lessonId,
  completeOnEnd,
  title,
  url,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/progress`,
          {
            isCompleted: true,
          }
        );

        
        toast.success("تم تحديث التقدم");
        router.refresh();

        
          router.push(
            `/courses/${courseId}`
          );
        

        
      }
    } catch {
      toast.error("هناك شئ غير صحيح");
    }
  };
  const SOURCES = [
    {
      src: url!,
      type: 'application/x-mpegURL',
    }
  ];
  return (
    <div className="relative aspect-video h-fit w-full">
      
      <div className={cn(!isReady && "")}>
        
        {url && (
          <LionPlayer 
            src={url!}
            autoplay="muted"
          
            height={450}
            controls={true} // Show player controls
          />
        )}
      </div>
    </div>
  );
};
