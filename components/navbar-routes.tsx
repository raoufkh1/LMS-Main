"use client";
import { useState, useEffect } from 'react';
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { isTeacher } from "@/lib/teacher";

import { SearchInput } from "./search-input";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';



export const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
  const isIntroductionCoursePage:boolean = pathname?.includes(process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID!);
  const isIntroductionCourseEditPage:boolean = pathname?.includes(process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID!) && pathname?.includes('teacher');
  const isSearchPage = pathname === "/search";
  const isStudentPage = pathname?.includes("/students");
  const isTaskPage = pathname?.includes("/students") && pathname?.includes("/course");
  const isReplyPage = pathname?.includes("/message/");
  const router = useRouter()
  const UserButtonWrapper = dynamic(() => import('@clerk/nextjs').then(module => module.UserButton), {
    ssr: false // Ensure component is not rendered on the server-side
  });


  

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        

      </div>
      <div className="flex gap-x-2 ml-auto">
          <div id="google_translate_element "></div>

          <UserButtonWrapper signInUrl="/sign-in" />
          {
          isStudentPage && !isTaskPage && (
            <Link href="/teacher/analytics">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                عودة
              </Button>
            </Link>
          )
          }
          {
          isTaskPage && (
            <Link  href='' onClick={e=> {return router.back()}}>
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                عودة
              </Button>
            </Link>
          )
          }
        {isCoursePage && !isIntroductionCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              عودة
            </Button>
          </Link>
        )  : null}
        {isIntroductionCourseEditPage ? (
          <Link href={`/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}`}>
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              عودة
            </Button>
          </Link>
        )  : null}
        {isReplyPage ? (
          <Link href="/message">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              عودة
            </Button>
          </Link>
        )  : null}
      </div>
    </>
  );
};
