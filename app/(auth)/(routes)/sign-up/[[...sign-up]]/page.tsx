import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return <SignUp forceRedirectUrl={`/courses/${process.env.NEXT_PUBLIC_INTRODUTION_COURSE_ID}`} />;
}