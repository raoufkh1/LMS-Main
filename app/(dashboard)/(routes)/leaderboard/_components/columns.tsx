"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn, isEmail, obfuscateEmailMiddleCharacters } from "@/lib/utils";
import { UserQuizPoints } from "@prisma/client";
import { GiStarMedal } from "react-icons/gi";
import { IoIosMedal } from "react-icons/io";
import { FaMedal } from "react-icons/fa";

type UserQuizPointsWithUserDetails = UserQuizPoints & {
  fullName: string;
  numberOfTakenQuizzes: number;
};
export const columns: ColumnDef<UserQuizPointsWithUserDetails>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          طالب
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fullName: string = row.getValue("fullName");

      if (isEmail(fullName)) {
        return <div>{obfuscateEmailMiddleCharacters(fullName)}</div>;
      }
    },
  },
  {
    accessorKey: "points",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "numberOfTakenQuizzes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عدد الاختبارات التي تم إجراؤها
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rank
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rank: number = row.getValue("rank");
      const rankToString = rank.toString();
      const rankSubString = rankToString.substring(0, rankToString.length);
      const rankSuperScriptText =
        rankSubString === "1"
          ? "st"
          : rankSubString === "2"
          ? "nd"
          : rankSubString === "3"
          ? "rd"
          : "th";

      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1">
            <GiStarMedal className="text-amber-300" />
            <div className="font-semibold text-lg pl-2">
              {rank}
              <sup className="">{rankSuperScriptText}</sup>
            </div>
          </div>
        </div>
      );
    },
  },
];
