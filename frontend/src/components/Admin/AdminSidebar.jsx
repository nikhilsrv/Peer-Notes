import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Check } from "lucide-react";
import { CircleDashed } from "lucide-react";
import { X } from "lucide-react";
import { PanelRight } from "lucide-react";

const AdminSidebar = ({ setSection }) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  return (
    <SidebarProvider
      className="w-[80px] border-[black]  relative z-40"
      open={sidebarOpen}
    >
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="block absolute top-0 h-full"
      >
        <SidebarContent className="bg-[#272727]  rounded-lg">
          <SidebarMenu className="mt-8 text-white ">
            <div
              onClick={() => setSection("pending")}
              className="cursor-pointer flex justify-center items-center  gap-x-3"
            >
              <span>
                <CircleDashed color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                {" "}
                Pending{" "}
              </span>
            </div>
            <div
              onClick={() => setSection("approved")}
              className="cursor-pointer mt-4 flex justify-center items-center  gap-x-3"
            >
              <span>
                <Check color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                {" "}
                Approved{" "}
              </span>
            </div>
            <div
              onClick={() => setSection("rejected")}
              className="cursor-pointer mt-4 flex justify-center items-center  gap-x-3"
            >
              <span>
                <X color="white" />
              </span>
              <span className={`w-[100px] ${!sidebarOpen ? "hidden" : ""} `}>
                {" "}
                Rejected{" "}
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

export default AdminSidebar;
