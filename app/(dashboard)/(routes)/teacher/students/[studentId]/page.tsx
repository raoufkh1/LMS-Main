import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UserProfile from './_components/UserProfile';
interface PageProps {
  params: { studentId: string };
}
const StudentsPage = async ({params}:PageProps) => {
    const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  return (
    <div className=''><UserProfile params={params}/></div>
  )
}
export default StudentsPage