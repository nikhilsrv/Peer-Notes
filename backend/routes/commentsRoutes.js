import express from "express";
import protectRoute from "../middlewares/protectRoute.js"
import { addComments } from "../controllers/commentsController.js";


const router=express.Router();

router.post("/addcomments",protectRoute,addComments);
export default router