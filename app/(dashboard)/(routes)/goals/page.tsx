import { Preview } from "@/components/preview"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"
import { auth } from "@clerk/nextjs"
import { GoalsEditButton } from "./_components/EditButton"
import { GoalsForm } from "./_components/GoalsForm"


const Goals = async () => {
    const {userId} = auth()
    const context = await db.goalsText.findFirst()
    return(
        <div dir="rtl">

            <GoalsForm  defaultContext={context?.context!} isTeacher={isTeacher(userId)}/>
        </div>
    )
}

export default Goals