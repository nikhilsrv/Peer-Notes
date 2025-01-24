import express from "express"
import protectRoute from "../middlewares/protectRoute.js";
import { changeStatus, deleteNotesAdmin, getAllNotesAdmin } from "../controllers/adminControllers.js";

const router=express.Router();

router.get("/getallnotes",protectRoute,getAllNotesAdmin);
router.delete("/deletenotes",protectRoute,deleteNotesAdmin)
router.put("/changestatus",protectRoute,changeStatus);


export default router