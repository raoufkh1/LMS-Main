"use client";

import { BarChart, Compass, Layout, List, Goal, MessageCircle, Contact,GraduationCap } from "lucide-react";
import { GiPodiumWinner } from "react-icons/gi";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";
import { isTeacher } from "@/lib/teacher";
import { useAuth } from "@clerk/nextjs";
import { FcStatistics } from "react-icons/fc";

const guestRoutes = [
  {
    icon: Layout,
    label: "لوحة القيادة – الدورات التدريبية",
    href: "/",
  },
  {
    icon: GraduationCap,
    label: "التعريف بالموقع",
    href: `/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}`
  },
  {
    icon: Goal,
    label: "اهداف عامة",
    href: "/goals",
  },
  {
    icon: MessageCircle,
    label: "منتدى النقاش",
    href: "/message",
  },
  {
    icon: GiPodiumWinner,
    label: "المتصدرين",
    href: "/leaderboard",
  },
  
  {
    icon: Contact,
    label: "تواصل معنا",
    href: "/contact",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "لوحة القيادة",
    href: "/teacher/courses",
  },
  {
    icon: FcStatistics,
    label: "الاحصائيات",
    href: "/teacher/analytics",
  },{
    icon: Layout,
    label: "الدورات التدريبية",
    href: "/",
  },
  {
    icon: GraduationCap,
    label: "التعريف بالموقع",
    href: `/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}`
  },
  {
    icon: Goal,
    label: "اهداف عامة",
    href: "/goals",
  },
  {
    icon: MessageCircle,
    label: "منتدى النقاش",
    href: "/message",
  },
  {
    icon: GiPodiumWinner,
    label: "المتصدرين",
    href: "/leaderboard",
  },
  
  {
    icon: Contact,
    label: "تواصل معنا",
    href: "/contact",
  },
  
  // {
  //   icon: BarChart,
  //   label: "Analytics",
  //   href: "/teacher/analytics",
  // },
];

export const SidebarRoutes = () => {
  const { userId } = useAuth();

  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacher(userId) ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
