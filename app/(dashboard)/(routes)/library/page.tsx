import { Preview } from "@/components/preview"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"
import { auth } from "@clerk/nextjs"
import { LibraryForm } from "./_components/LibraryForm"


const Library = async () => {
    const {userId} = auth()
    const context = await db.libraryText.findFirst()
    return(
        <div dir="rtl">

            <LibraryForm  defaultContext={context?.context!} isTeacher={isTeacher(userId)}/>
        </div>
    )
}

export default Library