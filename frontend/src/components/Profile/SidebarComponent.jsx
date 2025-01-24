import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { PanelRight } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { Upload } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { ClipboardPenLine } from 'lucide-react';
const SidebarComponent = ({ setSection,setOpen }) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  
  return (
    <SidebarProvider className="w-[80px] border-[black]  relative z-40"  open={sidebarOpen} >
      <Sidebar variant='sidebar' collapsible="icon" className="block absolute top-0 h-full">
        <SidebarContent className="bg-[#417BFF]  rounded-lg">
          <SidebarMenu className="mt-8 text-white ">
            <div onClick={()=>setSection("yourNotes")} className="cursor-pointer flex justify-center items-center  gap-x-3">
              <span>
                <NotebookPen color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                {" "}
                Your Notes{" "}
              </span>
            </div>
            <div
              onClick={() => setOpen(true)}
              className="cursor-pointer flex mt-4 justify-center items-center  gap-x-3"
            >
              <span>
                <Upload color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                Upload Notes
              </span>
            </div>
            <div onClick={()=>setSection("chats")} className="cursor-pointer mt-4 flex justify-center items-center  gap-x-3">
              <span>
                <MessageCircle color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                {" "}
                Chats{" "}
              </span>
            </div>
            <div onClick={()=>setSection("discuss")} className="cursor-pointer mt-4 flex justify-center items-center  gap-x-3">
              <span>
                <ClipboardPenLine color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                {" "}
                Discuss{" "}
              </span>
            </div>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div
        className="cursor-pointer ml-2 mt-2"
        onClick={() => setsidebarOpen(!sidebarOpen)}
      >
        <PanelRight />
      </div>
    </SidebarProvider>

  );
};

export default SidebarComponent;
