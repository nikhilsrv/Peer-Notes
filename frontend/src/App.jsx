import React, { useEffect, useState } from "react";
import Profile from "./components/Profile/Profile";
import Notes from "./pages/Notes";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CheckAuth from "./components/checkAuth";
import Home from "./pages/Home";
import { ca } from "./store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";
import MainLoader from "./components/MainLoader"
import "@/App.css"
import NotFound from "./pages/NotFound";
const App = () => {
  
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ca());
  }, [dispatch]);
  return isLoading ? (
    <MainLoader/>
  ) : (
    <>
      <div className="overflow-x-hidden">
        <Routes>
          <Route
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user} />
            }
          >
            <Route path="/notes" element={<Notes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin/>}/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/home" element={<Home />}/>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>
      <Toaster />
    </>
  );
};

export default App;
