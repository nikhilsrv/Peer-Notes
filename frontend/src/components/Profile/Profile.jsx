import React, { useEffect, useState } from "react";
import UploadNotes from "./UploadNotes";
import SidebarComponent from "./SidebarComponent";
import YourNotes from "./YourNotes";
import Chats from "./Chats";
import Discuss from "./Discuss";
import Navbar from "../Navbar";
const Profile = () => {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState("yourNotes");

  const changeSections = () => {
    switch (section) {
      case "yourNotes":
        return <YourNotes />;
      case "chats":
        return <Chats />;
      case "discuss":
        return <Discuss/>  
      default:
        return "";
    }
  };

  return (
    <>
    <Navbar/>
    <div className="relative flex w-screen">
      <SidebarComponent   setSection={setSection} setOpen={setOpen} />
      <UploadNotes open={open} setOpen={setOpen} />
      <div className="w-full mt-10 relative z-0">{changeSections()}</div>
    </div>
    </>
  );
};

export default Profile;
