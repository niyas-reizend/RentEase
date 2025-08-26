import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // or use "hotmail", "yahoo", or SMTP options
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//transporter for the sendong mai function, the password is app passowrd not the real password.