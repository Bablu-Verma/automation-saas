"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_password_reset_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const send_password_reset_email = async (resetLink, user_email) => {
    console.log("resetLink==", resetLink);
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Password Reset Request",
            text: `
              Dear User,

              We received a request to reset your password. Please copy and paste the following link into your browser to complete the process:
              ${resetLink}

              This link is valid for 20 minutes. If you did not request this, please ignore this email.

              Best regards,
              The Automation App Team
            `,
        });
        // console.log(`Message sent`, info);
    }
    catch (error) {
        console.log(`Error sending email:`, error);
    }
};
exports.send_password_reset_email = send_password_reset_email;
