import { forgotPasswordController, resetPasswordController } from "../controllers/password.controller";
import express from "express";


const passwordRouter = express.Router();

passwordRouter.post("/forgot-password", forgotPasswordController);
passwordRouter.post("/reset-password/:token", resetPasswordController);

export default passwordRouter;
