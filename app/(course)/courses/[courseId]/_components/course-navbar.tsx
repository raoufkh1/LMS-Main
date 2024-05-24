import {
  Chapter,
  Course,
  Lesson,
  Quiz,
  UserProgress,
  UserQuizPoints,
} from "@prisma/client";

import { NavbarRoutes } from "@/components/navbar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[] | null;
      })[];
      quiz: (Quiz & { userQuizPoints: UserQuizPoints[] | null }) | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
