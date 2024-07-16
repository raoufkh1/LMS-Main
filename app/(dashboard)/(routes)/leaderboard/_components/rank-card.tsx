import { cn } from "@/lib/utils";
import { BookOpenCheck, FileCheck } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";

interface RankCardProps {
  fullName: string;
  imageUrl: string | null;
  points: number;
  rank: number;
  lessonsCompleted: number;
}

const RankCard = ({ fullName, imageUrl, points, rank,lessonsCompleted }: RankCardProps) => {
  const image =
    rank === 1
      ? "/gold-medal.png"
      : rank === 2
        ? "/silver-medal.png"
        : "/bronze-medal.png";
  const imageAlt =
    rank === 1 ? "/gold-medal" : rank === 2 ? "/silver-medal" : "/bronze-medal";
  return (
    <div className="rounded-md border bg-slate-100 flex justify-between">
      <div className="space-y-4 p-4">
        <div className="flex space-x-2 items-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="user avatar"
              height={20}
              width={20}
              className="rounded-full"
            />
          ) : (
            <div className="bg-sky-500 rounded-full flex items-center justify-center h-12 w-12">
              {fullName.slice(0, 1)}
            </div>
          )}
          <h4 className="font-semibold text-lg">{fullName}</h4>
        </div>
        <div className="flex gap-2">
          <div className="rounded-md bg-slate-200 p-2">
            <div className="flex space-x-1 items-center">
              <FaStar size={20} className="text-sky-500" />
              <span className="text-xl font-bold ">{points}</span>
            </div>
          </div>
          
          
        </div>

      </div>
      <div className="max-h-full">
        <Image
          src={image}
          alt={imageAlt}
          height={100}
          width={100}
          className={cn(rank === 2 && "-mt-3")}
        />
      </div>
    </div>
  );
};

export default RankCard;
