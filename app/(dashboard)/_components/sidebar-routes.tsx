"use client";

import { BarChart, Compass, Layout, List, Goal, MessageCircle } from "lucide-react";
import { GiPodiumWinner } from "react-icons/gi";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "لوحة القيادة – الدورات التدريبية",
    href: "/",
  },
  {
    icon: Compass,
    label: "تصفح",
    href: "/search",
  },
  {
    icon: GiPodiumWinner,
    label: "المتصدرين",
    href: "/leaderboard",
  },
  {
    icon: Goal,
    label: "اهداف عامة",
    href: "#",
  },
  
  {
    icon: MessageCircle,
    label: "منتدى النقاش",
    href: "/message",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "الدورات",
    href: "/teacher/courses",
  },
  {
    icon: Compass,
    label: "تصفح",
    href: "/search",
  },
  {
    icon: GiPodiumWinner,
    label: "المتصدرين",
    href: "/leaderboard",
  },
  // {
  //   icon: BarChart,
  //   label: "Analytics",
  //   href: "/teacher/analytics",
  // },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

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
