"use client"
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { db } from "@/lib/db";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TaskAttachment } from "@prisma/client";
import { User } from "@clerk/nextjs/server";
import axios from "axios";



const TaskTeacherFiles = ({
    attachment,
    user
}: {
    attachment: TaskAttachment,
    user: User
}) => {
    
    

    


    return (
        <div>

            <div className="flex flex-col max-w-4xl mx-auto pb-20 pt-10" dir="rtl">
                

                <div className="space-y-4">
                            <div className="p-4">

                                    <div >
                                        <img className="w-8 h-8 rounded-full" src={user?.imageUrl} alt="Jese image" />
                                        <div className={`  "bg-sky-700/50" : msg.id == replyIs ? "bg-gray-400" : ''} flex flex-col w-[650px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700`}>
                                            <div className="flex items-center space-x-2 mb-4 rtl:space-x-reverse">
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{`${user?.firstName} ${user?.lastName ? user.lastName : ""}`}</span>
                                                {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{dateString}</span> */}
                                            </div>
                                            {attachment ? (<a
                                                href={attachment?.url}
                                                target="_blank"
                                                key={attachment?.id}
                                                className="flex space-x-2 items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                                            >
                                                <File />
                                                <div className="line-clamp-1">{attachment?.name}</div>
                                            </a>) : "لم يقم باكمال المهمة"}
                                            

                                        </div>
                                    </div>
                               
                            </div>

                </div>

            </div>
        </div>
    );
};

export default TaskTeacherFiles;
