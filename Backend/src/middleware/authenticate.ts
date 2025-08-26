import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import { decode } from "punycode";


const accessToken = process.env.ACCESS_TOKEN_SECRET!;

export const authenticate = (req:any,res:Response,next:NextFunction)=>{

    const authHeader = req.headers.authorization;
 
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error:"no token provided"});
    }

    const token = authHeader.split(" ")[1];
    try{
        const decoded =jwt.verify(token, accessToken)
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(403).json({error:"Invalid Token"});
    }
};