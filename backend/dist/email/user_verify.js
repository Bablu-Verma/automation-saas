"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_verify_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const user_verify_email = async (otp, user_email) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Signup Verification Code",
            text: `
      Dear User,

      Thank you for signing up.

      Your One-Time Password (OTP) for verification is: ${otp}

      Please enter this OTP to complete your registration. Do not share this code with anyone for security reasons.

      Best regards,  
      automation app Team
      `
        });
        console.log(`Message sent`, info);
    }
    catch (error) {
        console.log(`error sent`, error);
    }
};
exports.user_verify_email = user_verify_email;
