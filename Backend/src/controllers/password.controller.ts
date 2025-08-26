
import { Request, Response } from "express";
import { handleForgotPassword, handleResetPassword } from "../services/password.service";

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await handleForgotPassword(email);
    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const {token} = req.params;
    const {newPassword} = req.body;
    await handleResetPassword(token, newPassword);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
