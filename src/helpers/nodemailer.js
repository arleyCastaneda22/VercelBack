import nodemailer from"nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "beautysoft262@gmail.com",
    pass: process.env.CONTRASENA_DE_APLICACION,
  },
});





