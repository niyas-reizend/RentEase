import { Request,Response,NextFunction } from "express";

import dataSource from "../database/datasource";
import { User } from "../entities/User";
import { handleLogout } from "../controllers/auth.controller";

export const BlockMiddleware = async(req:any,res:Response,next:NextFunction)=>{
    try{

        const userRepo = dataSource.getRepository(User);
        const user = await userRepo.findOneBy({id:req.user.id});

        if(!user){
            return res.status(401).json({error:"User not found"});
        }

        if(user.isBlocked){
            return res.status(403).json({error:"Your account is blocked.Please contact Support"})
        }
        next();


    }catch(err){
        return res.status(500).json({error:"Server error while checking Block status"})
    }
}