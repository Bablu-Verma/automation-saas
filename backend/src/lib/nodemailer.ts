import nodemailer from 'nodemailer';




export const email_transporter = nodemailer.createTransport({
 host: 'smtp.ethereal.email',
 port: 587,
  secure: false,
  auth: {
    user: 'hulda.gaylord@ethereal.email',
    pass: 'KEkHTqgSxu7e5f2MhX',
  },
});


export const sender_email = `"Saas app" saas@automation.com`

