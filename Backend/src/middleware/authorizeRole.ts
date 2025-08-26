import { Request,Response,NextFunction } from "express";

export const authorizeRoles = (...roles: string[]) =>{

    return (req:any,res:Response,next:NextFunction)=>{
        const user = req.user;
        
        if(!user){
            return res.status(401).json({error:"No user info"})
        }
        if(!roles.includes(user.role)){
            return res.status(403).json({error:"Forbidden: You are not allowed to perfrom this operation"})
        }

        next();
    }
}