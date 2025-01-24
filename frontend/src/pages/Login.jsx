import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import google from "../assets/google.jpg"
import { loginUser } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  
  const dispatch=useDispatch();
  const [input,setInput]=useState({
    email:"",
    password:""
  });

  const handleLogin=(e)=>{
    e.preventDefault();
    dispatch(loginUser(input)).then((data)=>{
      if(data?.payload?.success)
        localStorage.setItem("user",data?.payload?.token)
        else
        toast({title:"Error",description:data?.payload?.message,variant:"destructive"})
    }).catch((err)=>{
      console.log(err)
    })
  }
  
  return (
    <div className="w-screen h-screen flex bg-[#F2F5FA] justify-center items-center">
      <div className="w-[70%] md:w-[50%] bg-[white]  border-[4px] shadow-lg  xl:w-[30%] py-8 rounded-lg">
        <h2 className="text-2xl md:text-4xl text-center text-[#417BFF] font-bold ">Login</h2>
        <form action="" className="mt-8 w-[70%] mx-auto flex flex-col  justify-center items-center gap-y-3">
              <Input className="text-[12px] md:text-[15px]" value={input.email} onChange={(e)=>{setInput({...input,email:e.target.value})}} placeholder="Enter email"/>
              <Input className="text-[12px] md:text-[15px]" value={input.password}  onChange={(e)=>{setInput({...input,password:e.target.value})}} placeholder="Enter password"/>
              <Button className="bg-[#417BFF] hover:bg-[#4178ff] mt-2" onClick={(e)=>handleLogin(e)}>Login</Button>
              <div className="mt-4 text-[12px] text-center"><Link to="/signup" className="text-center">Not registered ! Signup here</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
