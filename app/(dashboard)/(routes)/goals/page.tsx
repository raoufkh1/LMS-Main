import { Preview } from "@/components/preview"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"
import { auth } from "@clerk/nextjs/server"
import { GoalsEditButton } from "./_components/EditButton"
import { GoalsForm } from "./_components/GoalsForm"
import { DialogBox } from "../../_components/dialogueBox"


const Goals = async () => {
    const {userId} = auth()
    const context = await db.goalsText.findFirst()
    return(
        <div>

        <DialogBox page="goalsPage" />
        <div dir="rtl">

            <GoalsForm  defaultContext={context?.context!} isTeacher={isTeacher(userId)}/>
        </div>
        </div>
    )
}

export default Goals