import { prisma } from "../config/db.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords don't match" });
    }

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    user = await prisma.user.findUnique({
      where: {
        userName,
      },
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with given email or username",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
      },
    });

    if (newUser) {
      const token = jwt.sign(
        { userId: newUser.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15d",
        }
      );

      res.status(201).json({
        success: true,
        message: "User signedup successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.userName,
        },
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
        user: null,
        token: null,
      });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15d",
    });

    res.status(200).json({
      success: true,
      message: "User loggedin successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.userName,
      },
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
