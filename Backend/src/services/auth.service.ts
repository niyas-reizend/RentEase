import dataSource from "../database/datasource";
import { User } from "../entities/User";
import { comparePassword, hashPassword } from "../utils/hash";


    const userRepo = dataSource.getRepository(User)



// Register User 
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "admin" | "tenant" | "owner" | "agent"
) => {
  const existing = await userRepo.findOneBy({ email });
  if (existing) {
    throw new Error("User with this email already exists.");
  }

  const hashed = await hashPassword(password);

  const newUser = userRepo.create({
    name,
    email,
    password: hashed,
    role,
  });

  return await userRepo.save(newUser);
};




// Login 

import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens";

export const loginUser = async (email: string, password: string) => {
  const user = await userRepo.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }
  if(user.isBlocked){
    throw new Error("You are Blocked by the Admin")
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);


  return {
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens: {
      accessToken,
      refreshToken
    },
  };
};


// get all users 

export const getAllUsers = async () => {
  const userRepo = dataSource.getRepository(User);
  const users = await userRepo.find({
    relations: [
      "properties",
      "handledProperties",
      "tenantProfile",
      "enquiries",
      "tenantAgreement",
      "ownerAgreements",
      "commissions",
      "resetTokens"
    ],
    order: {
      createdAt: "DESC"
    }
  });
  return users;
};


// get all agent 
export const getAllAgent = async () => {
  const userRepo = dataSource.getRepository(User);
  const agents = await userRepo.find({
    where: { role: 'agent' },
    select: ['id', 'name', 'email', 'role', 'isBlocked'], // select only necessary fields
    order: { createdAt: "DESC" }
  });
  return agents;
};


// delete user 

export const deleteUserById = async (id: number) => {
  const user = await userRepo.findOne({ where: { id } });

  if (!user) {
    return {success:false,message:"user not found"}; // Not found
  }

  await userRepo.remove(user); // or: await userRepo.delete(id)
  return {success:true,message:"user deletion successfull"};
};


// block or unblock user 

export const updateUserBlockStatus = async (id: number, isBlocked: boolean) => {
  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.findOne({ where: { id } });

  if (!user) return null;

  user.isBlocked = isBlocked;
  return await userRepo.save(user);
};