import crypto from "crypto";
import { ResetToken } from "../entities/ResetToken";
import dataSource from "../database/datasource";
import { User } from "../entities/User";
import { sendResetEmail } from "../utils/sendResetEmail";
import { hashPassword } from "../utils/hash";


const userRepo = dataSource.getRepository(User)
const resetTokenRepo = dataSource.getRepository(ResetToken)

export const handleForgotPassword = async (email: string) => {
  const user = await userRepo.findOneBy({ email });
  if (!user) throw new Error("User not found");

  // Clear old tokens
  await resetTokenRepo.delete({ user: { id: user.id } });

  const token = crypto.randomBytes(4).toString("hex");
  console.log(token);
  
  const expiresAt = new Date(Date.now() + 2000 * 60 * 60); // 2 hour

  const resetToken = resetTokenRepo.create({ user, token, expiresAt });
  await resetTokenRepo.save(resetToken);
  console.log(resetToken)

//   const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendResetEmail(email, resetToken);
};

export const handleResetPassword = async (token: string, newPassword: string) => {
  const resetToken = await resetTokenRepo.findOne({
    where: { token:token },
    relations: ["user"],
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    throw new Error("Invalid or expired token");
  }
   const hashedpassword = await hashPassword(newPassword)
  resetToken.user.password = hashedpassword; // You can hash it here
  await userRepo.save(resetToken.user);

  await resetTokenRepo.delete({ id: resetToken.id }); // delete token after use
};
