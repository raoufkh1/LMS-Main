"use client"

import { useEffect, useState } from "react"
import { useDisclosure } from '@chakra-ui/react'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { onClose, onOpen } from "@/lib/trigger"
import { useRouter } from "next/navigation";
import axios from "axios";
import { data } from "@/lib/page";
export const DialogBox = ({ page }: { page?: string }) => {
    const [popup, setPopup] = useState<boolean>(false)
    const [showAgain,setShowAgain] = useState(false)
    useEffect(() => {
        async function getStatus() {
            try {

                const { data } = await axios.get(`/api/dialog`)
                if (data) {
                    console.log(data)
                    setPopup(!data[page!])
                }
                else {
                    setPopup(false)
                }
            }
            catch (e) {

            }
        }
        getStatus()
    }, [])
    const trigger = useSelector((state: RootState) => state.trigger.value);
    const dispatch = useDispatch();
    const router = useRouter()
    const handleClick = async (open:boolean) => {
        try {
            let object: any = {}
            object[page!] = true
            if(open){
                dispatch(onOpen())

            }
            setPopup(false)

            if(showAgain){
                const { data } = await axios.post(`/api/dialog`, { object })
                if (data) {
                    console.log(data)
                }
                else {
                }
                
            }
        }
        catch (e) {

        }
    }
    const [check, setCheck] = useState<any>()
    return (
        <div>
            {
                popup &&
                <div className='z-50 w-full h-full'>

                    <div className='h-[200%] w-full bg-black z-50 opacity-40 visible fixed '>
                    </div>
                    <div id="static-modal" data-modal-backdrop="static" style={{
                        left: "35%",
                        top: "70%",
                        transform: " translate(-50%, -50%)"
                    }} tabIndex={-1} dir='rtl' className=" overflow-y-auto overflow-x-hidden z-50 justify-center fixed items-center left-[300px]   md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">

                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        النظام الخبير
                                    </h3>
                                    <button onClick={e => handleClick(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                                        <svg  className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>

                                <div className="px-4  md:px-5 space-y-4">
                                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                        {data[page!]}
                                    </p>
                                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-400">
                                    هل تحتاج المزيد من التوضيح؟
                                    </p>
                                </div>
                                <div className="flex px-4 md:px-5 gap-4">
                                    <input type="checkbox" onChange={e => setShowAgain(e.target.checked)} />
                                    <p> الرجاء عدم اظهار الرسالة مرة أخرى</p>
                                </div>
                                <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <button onClick={e => handleClick(true)} data-modal-hide="static-modal" type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">نعم</button>
                                    <button onClick={e => handleClick(false)} data-modal-hide="static-modal" type="button" className="text-black bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-white dark:hover:bg-blue-700 dark:focus:ring-blue-800">لا</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

        </div>

    )
}

