import express from "express"
import { login, signup } from "../controllers/authControllers.js";
import protectRoute from "../middlewares/protectRoute.js"

const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.get("/checkauth",protectRoute,(req,res)=>{
    const user=req.user
   return res.status(200).json({
        success: true,
        message: "Authenticated user!",
        user,
      });
})

export default router