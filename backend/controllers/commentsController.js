import { prisma } from "../config/db.js";

export const addComments = async (req, res) => {
  try {
    const { notesId, value } = req.body;
    const userId = req.user.id;

    if (!notesId || !value) {
      return res.status(400).json({
        success: false,
        message: "You can't do an empty comment",
      });
    }

    const note = await prisma.note.findUnique({
      where: {
        id: parseInt(notesId),
      },
    });

    if (!note) {
      return res.status(400).json({
        success: false,
        message: "Invalid notes data",
      });
    }

    if(note.userId===userId){
      return res.status(400).json({
        success:false,
        message:"You can't comment on your own notes"
      })
    }

    const comment = await prisma.comment.create({
      data: {
        userId:parseInt(userId),
        notesId:parseInt(notesId),
        value,
      },
    });

    if (comment) {
      return res.status(200).json({
        success: true,
        message: "Comment added successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid comment data",
      });
    }
  } catch (error) {
    console.log("Error in add comment controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


