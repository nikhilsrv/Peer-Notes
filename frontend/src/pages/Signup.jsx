import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupUser } from "@/store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
const Signup = () => {
  const dispatch=useDispatch();

  const [input,setInput]=useState({
    email:"",
    userName:"",
    password:"",
    confirmPassword:""
  })

  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(signupUser(input)).then((data)=>{
      if(data?.payload?.success)
      localStorage.setItem("user",data?.payload?.token)
      else{
      toast({title:"Error",description:data?.payload?.message,variant:"destructive"}) 
      }
    })
  }

  return (
    <div className="w-screen h-screen bg-[#F2F5FA] flex justify-center items-center">
      <div className="border-[4px] bg-[white]  shadow-lg w-[70%] md:w-[50%] xl:w-[30%] py-4 rounded-lg">
        <h2 className="text-2xl md:text-4xl text-center font-bold text-[#417BFF] ">Signup</h2>
        <form
          action=""
          className="mt-4 md:mt-8 w-[70%] mx-auto flex flex-col justify-center items-center gap-y-3"
        >
          <Input value={input.email} className="text-[12px] md:text-[15px]" onChange={(e)=>setInput({...input,email:e.target.value})} placeholder="Enter email" />
          <Input value={input.userName} className="text-[12px] md:text-[15px]" onChange={(e)=>setInput({...input,userName:e.target.value})} placeholder="Enter username" />
          <Input value={input.password} className="text-[12px] md:text-[15px]" onChange={(e)=>setInput({...input,password:e.target.value})} placeholder="Enter password" />
          <Input value={input.confirmPassword} className="text-[12px] md:text-[15px]" onChange={(e)=>setInput({...input,confirmPassword:e.target.value})} placeholder="Confirm password" />
          <Button className="bg-[#417BFF] hover:bg-[#4178ff] mt-2" onClick={(e)=>handleSubmit(e)}>Signup</Button>
          <div className="mt-4 text-[12px] text-center"><Link to="/login" className="text-center">Already registered ! Sign in</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
