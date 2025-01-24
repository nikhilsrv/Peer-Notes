import express from "express"
import { upload } from "../config/multer.js";
import protectRoute from "../middlewares/protectRoute.js"
import {addNotes, deleteNotes, downloadFiles, downloadSingleFile, editNotes, getAllNotes, getNotesDetail, getUserNotes, likeDislikeNote, uploadFiles} from "../controllers/notesController.js" 

const router=express.Router();

router.post("/uploadfiles",protectRoute,upload.array("files",10),uploadFiles);
router.post("/addnotes",protectRoute,addNotes);
router.get("/getusernotes",protectRoute,getUserNotes);
router.get("/getnotesdetail/:notesid",protectRoute,getNotesDetail);
router.post("/editnotes",protectRoute,editNotes)
router.get("/getallnotes",protectRoute,getAllNotes);
router.post("/likedislike",protectRoute,likeDislikeNote);
router.post("/download",protectRoute,downloadFiles)
router.post("/downloadsinglefile",protectRoute,downloadSingleFile)
router.delete("/deletenotes",protectRoute,deleteNotes)

export default router