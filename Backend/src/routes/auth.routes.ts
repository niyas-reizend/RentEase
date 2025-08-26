import { Router } from "express";
import {  handleDeleteUser, handleGetAllAgent, handleGetAllUsers, handleLogin,  handleLogout,  handleRefreshToken,  handleRegister, handleUpdateBlockStatus } from "../controllers/auth.controller";
import { authorizeRoles } from "../middleware/authorizeRole";
import { authenticate } from "../middleware/authenticate";

const authRouter = Router();

authRouter.post("/register",handleRegister);
authRouter.post("/login",handleLogin);
authRouter.post("/logout",handleLogout);
authRouter.post("/refresh",handleRefreshToken);
authRouter.get("/getallusers",authenticate,authorizeRoles("admin"), handleGetAllUsers);  //to get all the users
authRouter.delete("/users/:id",authenticate,authorizeRoles("admin"),handleDeleteUser); //to delete the users
authRouter.patch("/users/block-status",authenticate,authorizeRoles("admin"), handleUpdateBlockStatus) //to block the users
authRouter.get("/getAllAgents",handleGetAllAgent);

export default authRouter;
