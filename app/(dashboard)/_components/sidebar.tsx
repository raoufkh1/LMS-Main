import { db } from "@/lib/db"
import { Logo } from "./logo"
import { SidebarRoutes } from "./sidebar-routes"

export const Sidebar = async () => {
  const courses = await db.course.findMany()
  const lastCourse = courses.sort((a:any,b:any)=> b.updatedAt-a.updatedAt)[0]
  const lastCourseEditDate = new Date(lastCourse.updatedAt)

  return (
    <div className="h-full border-r custom-scroll-bar relative flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
      <p className="bottom-8 pt-4 text-xs text-gray-400 text-center right-8">
        اخر تحديث للموقع بتاريخ {`${lastCourseEditDate.getFullYear()}/${lastCourseEditDate.getMonth() + 1}/${lastCourseEditDate.getDate()}`} 
      </p>
    </div>
  )
}