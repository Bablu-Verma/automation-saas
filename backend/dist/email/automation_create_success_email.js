"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automation_create_success_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const automation_create_success_email = async (user_email, user_name, automation_name) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: `Automation "${automation_name}" Created Successfully`,
            text: `
        Dear ${user_name},

        Your automation "${automation_name}" has been successfully created.

        You can now view and manage this automation from your dashboard.

        Thank you for using Automation App!

        Best regards,
        Automation App Team
      `
        });
        console.log("Automation creation success email sent:", info);
    }
    catch (error) {
        console.log("Error sending automation creation email:", error);
    }
};
exports.automation_create_success_email = automation_create_success_email;
