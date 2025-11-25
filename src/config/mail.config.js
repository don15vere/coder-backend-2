import nodemailer from "nodemailer";

const { MAIL_USER, MAIL_PASS } = process.env;

export const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
  secure: false,
  port: 587,
  tls: {
    rejectUnauthorized: false  
  }
});