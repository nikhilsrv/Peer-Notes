import React from "react";
import home from "@/assets/home3.png";
import "@/App.css";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="w-full h-[80vh]  flex flex-row justify-center  items-center gap-10">
        <div className="hidden md:block w-[35%]">
          <img src={home} className="rounded-lg" alt="" />
        </div>
        <div className="w-[80%] flex flex-col justify-center items-center md:block md:w-[40%]">
          <h2 className="text-center text-2xl lg:text-4xl font-bold text-[#417BFF]">
            Peer Notes
          </h2>
          <div className="text-center text-[15px] lg:text-[20px] mt-5">
            Empower your exam prep here - upload, share, and access subject
            notes tailored by college students, for college students. Simplify
            studying and succeed together!
          </div>
          <div className="flex justify-center mt-5">
            <Link to="/notes">
              <button className="text-[15px] lg:text-[20px] font-bold px-8 py-3 bg-[#417BFF] text-[white] rounded-[40px]">
                Explore Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
