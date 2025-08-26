import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessToken = process.env.ACCESS_TOKEN_SECRET!;
const refreshToken = process.env.REFRESH_TOKEN_SECRET!;


type UserPayload = {
  id: number;
  role: "tenant" | "owner" | "agent" | "admin";
};

// Access token 
export const generateAccessToken = (user: UserPayload) => {
  return jwt.sign(user, accessToken, { expiresIn: '30m'});
};

// Refresh Token 
export const generateRefreshToken = (user: UserPayload): string => {
  return jwt.sign(user, refreshToken, { expiresIn: '1d' });
};


// export const verifyRefreshToken = (token: string): UserPayload => {
//   return jwt.verify(token, refreshToken) as UserPayload;
// };
