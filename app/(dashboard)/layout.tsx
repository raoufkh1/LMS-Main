"use client"
import { useEffect, useState } from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { Popup } from "./_components/popup";
import { useParams } from 'next/navigation'
const DashboardLayout = ({ children }: { children: React.ReactNode}) => {
  const [popup, setPopup] = useState(false)
  const params = useParams()
  const welcomeMsg = localStorage.getItem("welcome")
  useEffect(() => {
    if(welcomeMsg){
      console.log(welcomeMsg)
      return
    }
    setPopup(true)
  },[])
  
  return (
    <div className="h-full relative w-full">
      
      {
          popup && <Popup setPopup={setPopup}/>
        }
      <div className="h-[80px] md:pr-56 fixed inset-y-0 w-full z-40">
        <Navbar />
      </div>

      <main className="md:pr-56 pt-[80px] h-full">
        
        {children}</main>
      <div className="hidden md:flex h-full w-56 flex-col fixed right-0 inset-y-0 z-40">
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
