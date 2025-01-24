import React, { useEffect, useRef, useState } from "react";
import Container from "../components/Admin/Container";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminFilter from "@/components/Admin/AdminFilter";
import { getAllNotes } from "@/store/slices/adminSlice";
import { useDispatch } from "react-redux";
import Navbar from "@/components/Navbar";
const Admin = () => {
  const [section, setSection] = useState("pending");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery,setSearchQuery]=useState("")
  const dispatch=useDispatch()
  const searchParams=useRef({
      branch:[],
      searchQuery:"",
      status:""
    })

  useEffect(()=>{
    searchParams.current.status=section
    dispatch(getAllNotes(new URLSearchParams({filter:JSON.stringify(searchParams.current)}).toString()));
  },[section])

  const changeSections = () => {
    switch (section) {
      case "approved":
        return <Container searchParams={searchParams} section={section} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setFilterOpen={setFilterOpen} />;
      case "pending":
        return <Container searchParams={searchParams} section={section} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setFilterOpen={setFilterOpen}/>;
      case "rejected":
        return <Container searchParams={searchParams} section={section} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setFilterOpen={setFilterOpen}/>;
      default:
        return "";
    }
  };
  return (<>
    <Navbar/>
    <div className="relative flex w-screen h-screen">
      <AdminSidebar setSection={setSection} />
      <div className="mt-10 relative z-0">{changeSections()}</div>
      <AdminFilter filterOpen={filterOpen} searchQuery={searchQuery}  searchParams={searchParams} setFilterOpen={setFilterOpen} />
    </div></>
  );
};

export default Admin;
