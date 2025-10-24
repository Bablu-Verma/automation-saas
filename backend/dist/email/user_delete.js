"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_delete_success_email = exports.user_delete_request_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
/**
 * 1️⃣ User Delete Request Email
 */
const user_delete_request_email = async (user_email, user_name) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Account Deletion Request Received",
            text: `
        Dear ${user_name},

        We have received your request to delete your account.

        Your account deletion will be processed shortly. If you did not request this deletion, please contact our support team immediately to secure your account.

        Best regards,
        Automation App Team
      `
        });
        console.log("Delete request email sent:", info);
    }
    catch (error) {
        console.log("Error sending delete request email:", error);
    }
};
exports.user_delete_request_email = user_delete_request_email;
/**
 * 2️⃣ User Delete Success Email
 */
const user_delete_success_email = async (user_email, user_name) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Account Successfully Deleted",
            text: `
        Dear ${user_name},

        Your account has been successfully deleted from Automation App.

        We're sorry to see you go! If this was a mistake or you wish to join us again in the future, feel free to sign up anytime.

        Best regards,
        Automation App Team
      `
        });
        console.log("Delete success email sent:", info);
    }
    catch (error) {
        console.log("Error sending delete success email:", error);
    }
};
exports.user_delete_success_email = user_delete_success_email;
