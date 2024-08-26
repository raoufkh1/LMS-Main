import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <SignIn forceRedirectUrl={`/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}`}/>;
}