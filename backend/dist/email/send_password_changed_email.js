"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_password_changed_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const send_password_changed_email = async (user_email) => {
    try {
        await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Password Changed Successfully - Automation App",
            text: `
Dear User,

This is a confirmation that your password for Automation App has been successfully changed.

✅ If you performed this change, no further action is required.

⚠️ If you did NOT change your password, please **reset your password immediately** to secure your account.

Best regards,
The Automation App Team
      `,
        });
        console.log(`Password change confirmation email sent successfully to ${user_email}`);
    }
    catch (error) {
        console.error(`Error sending password change email:`, error);
    }
};
exports.send_password_changed_email = send_password_changed_email;
