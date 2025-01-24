import { prisma } from "../config/db.js";
import archiver from "archiver";
import axios from "axios";

export const getAllNotesAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter } = req.query;

    const branch = filter ? JSON.parse(filter)?.branch || [] : [];
    const searchQuery = filter ? JSON.parse(filter)?.searchQuery || "" : "";
    const status = filter ? JSON.parse(filter)?.status || "" : "";

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          branch.length
            ? {
                branch: {
                  in: branch,
                },
              }
            : {},
          searchQuery
            ? {
                subject: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              }
            : {},
          status
            ? {
                status,
              }
            : {},
        ],
      },
      include: {
        user: {
          select: {
            userName: true,
          },
        },
      },
    });

    if (notes) {
      return res.status(200).json({
        success: true,
        notes,
        message: "Notes fetched successfully",
      });
    } else
      return res.status(400).json({ success: false, message: "Invalid data" });
  } catch (error) {
    console.log("Error in getAllNotes admin-controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteNotesAdmin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notesId } = req.body;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist ",
      });

    if (req?.user?.role !== "admin")
      return res.status(400).json({
        success: false,
        message: "You can't delete the following notes",
      });

    if (!notesId) {
      return res.status(400).json({
        success: false,
        message: "Can't delete notes",
      });
    }

    const response = await prisma.note.delete({
      where: {
        id: notesId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notes deleted successfully",
    });
  } catch (error) {
    console.log("Error in deletenotes controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const changeStatus=async(req,res)=>{
   
  try{
    const userId=req.user.id
    
    const role=req.user?.role
    console.log(role)
    const {newStatus,notesId}=req.body

    if(role!=="admin"){
      return res.status(400).json({
        success: false,
        message: "You can't change the status of notes",
      })
     }
   
    if(!newStatus||!notesId){
      return res.status(400).json({
        success: false,
        message: "Details not sufficent to change status",
      })
    }
   
    const notes=await prisma.note.findUnique({
      where:{
        id:notesId
      }
    })
    
    if(!notes){
      return res.status(400).json({
        success: false,
        message: "Notes doesn't exist",
      })
    }

    const response=await prisma.note.update({
      where:{
        id:notesId
      },
      data:{
         status:newStatus
      }
    })

    return res.status(200).json({
      success:true,
      message:"Status changed successfully"
    })
  }
  catch(error){
    console.log("Error in change status controller admin",error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Errror"
    })
  }
}