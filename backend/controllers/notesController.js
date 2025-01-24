import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { prisma } from "../config/db.js";
import archiver from "archiver";
import axios from "axios";
import { sendMail } from "../utils/sendMail.js";

export const uploadFiles = async (req, res) => {
  try {
    const fileUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });
      const obj = { originalname: file.originalname, url: result.secure_url };
      fs.unlinkSync(file.path);
      fileUrls.push(obj);
    }

    res.status(200).json({
      success: true,
      files: fileUrls,
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to upload images" });
  }
};

export const addNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail=req?.user?.email
    const { subject, branch, files } = req.body;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist ",
      });

    if (!subject || !branch || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Fields can't be empty",
      });
    }

    const newNote = await prisma.note.create({
      data: {
        userId,
        subject,
        branch,
        files,
      },
    });

    if (newNote) {
      sendMail(userEmail,"notes uploaded")
      return res.status(200).json({
        success: true,
        message: "Notes added successfully",
      });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Invalid notes data" });
  } catch (error) {
    console.log("Error in addNotes controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter } = req.query;

    const branch = filter ? JSON.parse(filter)?.branch || [] : [];
    const searchQuery = filter ? JSON.parse(filter)?.searchQuery || "" : "";

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
          {
            status: "approved",
          },
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
    console.log("Error in getAllNotes controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUserNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { filter } = req.query;

    const branch = filter ? JSON.parse(filter)?.branch || [] : [];
    const searchQuery = filter ? JSON.parse(filter)?.searchQuery || "" : "";

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });

    const notes = await prisma.note.findMany({
      where: {
        AND: [
          {userId:userId},
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
    console.log("Error in getUserNotes controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getNotesDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notesid } = req.params;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });

    let notesDetail = await prisma.note.findUnique({
      where: { id: parseInt(notesid) },
      include: {
        user: {
          select: {
            userName: true,
          },
        },
        Comment: {
          select: {
            user: {
              select: {
                userName: true,
              },
            },
            value: true,
            createdAt: true,
          },
        },
      },
    });

    const hasLiked = notesDetail?.likes.includes(userId);
    const hasDisliked = notesDetail?.dislikes.includes(userId);

    if (notesDetail) {
      return res.status(200).json({
        success: true,
        notesDetail,
        hasDisliked,
        hasLiked,
        message: "Notes detail fetched successfully",
      });
    } else
      return res.status(400).json({ success: false, message: "Invalid data" });
  } catch (error) {
    console.log("Error in getNotesDetail controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const editNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subject, branch, files, id } = req.body;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist ",
      });

    if (!subject || !branch || files.length === 0 || !id) {
      return res.status(400).json({
        success: false,
        message: "Fields can't be empty",
      });
    }

    const response = await prisma.note.update({
      where: {
        id: id,
      },
      data: {
        subject,
        branch,
        files,
      },
    });

    if (response) {
      return res.status(200).json({
        success: true,
        message: "Notes updated successfully",
      });
    } else
      return res
        .status(400)
        .json({ success: false, message: "Invalid note data" });
  } catch (error) {
    console.log("Error in editnotes controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const likeDislikeNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, view } = req.body;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist ",
      });

    if (!view) {
      return res.status(400).json({
        success: false,
        message: "Either Like or Dislike ",
      });
    }

    const note = await prisma.note.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (note?.userId === userId) {
      return res.status(400).json({
        success: false,
        message: "You can't vote on your own notes",
      });
    }

    let likes = note?.likes;
    let dislikes = note?.dislikes;

    if (view === "like") {
      const hasLiked = likes.includes(userId);
      const hasDisliked = dislikes.includes(userId);

      if (!hasLiked && !hasDisliked) {
        likes.push(userId);
        await prisma.note.update({
          where: {
            id: id,
          },
          data: {
            likes,
          },
        });
      }

      if (hasLiked) {
        const newLikes = likes.filter(
          (item) => item.toString() !== userId.toString()
        );
        likes = [...newLikes];
        await prisma.note.update({
          where: {
            id: id,
          },
          data: {
            likes,
          },
        });
      }

      if (hasDisliked) {
        const newDislikes = dislikes.filter(
          (item) => item.toString() !== userId.toString()
        );
        dislikes = [...newDislikes];
        likes.push(userId);
        await prisma.note.update({
          where: {
            id: id,
          },
          data: {
            likes,
            dislikes,
          },
        });
      }
    } else {
      const hasDisliked = dislikes.includes(userId);
      const hasLiked = likes.includes(userId);

      if (!hasLiked && !hasDisliked) {
        dislikes.push(userId);
        await prisma.note.update({
          where: {
            id: id,
          },
          data: {
            dislikes,
          },
        });
      }

      if (hasDisliked) {
        const newDislikes = dislikes.filter(
          (item) => item.toString() != userId.toString()
        );
        dislikes = [...newDislikes];
        await prisma.note.update({
          where: {
            id: id,
          },
          data: {
            dislikes,
          },
        });
      }

      if (hasLiked) {
        const newLikes = likes.filter(
          (item) => item.toString() != userId.toString()
        );
        likes = [...newLikes];
        dislikes.push(userId);
        await prisma.note.update({
          where: {
            id: id,
          },
          data: {
            dislikes,
            likes,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Vote updated successfully",
    });
  } catch (error) {
    console.log("Error in likedislike controller ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const downloadFiles = async (req, res) => {
  try {
    const files = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid or empty URL list provided.",
      });
    }

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="files.zip"`,
    });

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    try {
      for (const file of files) {
        const response = await axios.get(file.url, { responseType: "stream" });
        archive.append(response.data, { name: file.originalname });
      }
      await archive.finalize();
    } catch (error) {
      console.log("Error creating ZIP:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } catch (error) {
    console.log("Error in download file controller ", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const downloadSingleFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    const response = await axios.get(fileUrl, {
      responseType: "stream",
      timeout: 10000,
    });

    // Set appropriate headers
    res.setHeader("Content-Disposition", `attachment; filename="file"`);
    res.setHeader("Content-Type", response.headers["content-type"]);

    // Pipe the file to the response
    response.data.pipe(res);
  } catch (error) {
    console.log("Error in downloadSingleFile controller", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to download file" });
  }
};

export const deleteNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notesId } = req.body;

    if (!userId)
      return res.status(400).json({
        success: false,
        message: "User doesn't exist ",
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
