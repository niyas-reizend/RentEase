import { Request, Response } from "express";
import {
  deleteUserById,
  getAllAgent,
  getAllUsers,
  loginUser,
  registerUser,
  updateUserBlockStatus,
} from "../services/auth.service";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/generateTokens";
import { decode } from "punycode";

type UserPayload = {
  id: number;
  role: "tenant" | "owner" | "agent" | "admin";
};

// Registering User
export const handleRegister = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    role: Joi.string().required(),
  });

  const { error } = userSchema.validate({ name, email, password, role });

  if (error) {
    return res.json({ error: "Validation Failed" });
  }

  try {
    const user = await registerUser(name, email, password, role);
    return res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// Login
export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await loginUser(email, password);
    // Destructure Tokens
    const {
      tokens: { refreshToken },
    } = result;

    //storing the refresh token in the cookie (HttpOnly)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      // maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: result.message,
      user: result.user,
      tokens: {
        accessToken: result.tokens.accessToken,
      },
    });
  } catch (err: any) {
    if (
      err.message === "User not found" ||
      err.message === "Invalid password"||
      err.message ==="You are Blocked by the Admin"
    ) {
      return res.status(401).json({ error: err.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

// get all users
export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all agent
export const handleGetAllAgent = async (req: Request, res: Response) => {
  try {
    const agents = await getAllAgent();
    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// delete user
export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await deleteUserById(userId);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// block or unblock users
export const handleUpdateBlockStatus = async (req: Request, res: Response) => {
  try {
    const { userId, action } = req.body;

    if (!userId || !["block", "unblock"].includes(action)) {
      return res.status(400).json({ error: "Invalid user ID or action" });
    }

    const isBlocked = action === "block";
    const updatedUser = await updateUserBlockStatus(userId, isBlocked);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user block status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// access token genration using Refresh token

export const handleRefreshToken = async (req: any, res: Response) => {

  const refreshToken = process.env.REFRESH_TOKEN_SECRET;
  
  const reftoken = req?.cookies.refreshToken;
  
  if (!reftoken) {
    return res.status(401).json({ error: "No refresh token Provided" });
  }
  try {
    const decoded = jwt.verify(reftoken, refreshToken!) as UserPayload;

    const newAccessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.log("eroor======", err);
  }
};
// logout
export const handleLogout = (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
