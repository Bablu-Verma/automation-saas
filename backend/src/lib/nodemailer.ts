import nodemailer from 'nodemailer';


export const sender_email = `taskzenoautomat@gmail.com`

export const email_transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_KEY,
  },
});




