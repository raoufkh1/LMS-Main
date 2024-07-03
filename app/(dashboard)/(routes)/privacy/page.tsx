import { Preview } from "@/components/preview"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"
import { auth } from "@clerk/nextjs"
import { PrivacyForm } from "./_components/PrivacyForm"


const Privacy = async () => {
    const {userId} = auth()
    const context = await db.policiesText.findFirst()
    console.log()
    return(
        <div dir="rtl">

            <PrivacyForm  defaultContext={context?.context!} isTeacher={isTeacher(userId)}/>
        </div>
    )
}

export default Privacy