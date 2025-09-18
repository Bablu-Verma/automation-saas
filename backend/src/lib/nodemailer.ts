import nodemailer from 'nodemailer';


export const sender_email = `"Saas app" saas@automation.com`

export const email_transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_KEY,
  },
});




