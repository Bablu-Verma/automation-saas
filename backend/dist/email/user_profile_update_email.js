"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_profile_update_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const user_profile_update_email = async (user_email, user_name) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Profile Updated Successfully",
            text: `
        Dear ${user_name},

        We wanted to let you know that your profile has been updated successfully.

        If you did not make this change or notice any suspicious activity, please contact our support team immediately.

        Thank you for keeping your information up to date!

        Best regards,
        Automation App Team
      `
        });
        console.log("Profile update email sent successfully:", info);
    }
    catch (error) {
        console.log("Error sending profile update email:", error);
    }
};
exports.user_profile_update_email = user_profile_update_email;
