import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";

import { InfoCard } from "./_components/info-card";
import { getCourses } from "@/actions/get-courses";
import { env } from "process";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }


  const introductionCourseId = process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID
  const coursesNot = await getCourses({userId})
  const courses:any = coursesNot.filter((e) => e.id != introductionCourseId)
  const coursesInProgress = courses.filter((courses:any) => courses.progress > 0 && courses.progress < 100 )
  const completedCourses = courses.filter((courses:any) => courses.progress > 0 && courses.progress == 100 )
  const coursesNotStartedYet = courses.filter((courses:any) => courses.progress == 0 )
  console.log()
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="في تَقَدم"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="مكتمل"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...completedCourses, ...coursesInProgress, ...coursesNotStartedYet]} />
    </div>
  );
}
