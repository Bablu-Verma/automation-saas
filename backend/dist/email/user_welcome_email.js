"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_welcome_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const user_welcome_email = async (user_email, user_name) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Welcome to Automation App!",
            text: `
        Dear ${user_name},

        Welcome to Automation App! We're thrilled to have you on board.

        You can now explore all the features we offer and make the most out of our platform.

        If you have any questions, feel free to reach out to our support team.

        Best regards,
        Automation App Team
      `
        });
        console.log("Welcome email sent successfully:", info);
    }
    catch (error) {
        console.log("Error sending welcome email:", error);
    }
};
exports.user_welcome_email = user_welcome_email;
