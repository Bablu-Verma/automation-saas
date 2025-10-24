"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAutomationStatusUpdateEmail = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const sendAutomationStatusUpdateEmail = async (email, username, instanceName, newStatus) => {
    try {
        await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: email,
            subject: `Your Automation "${instanceName}" Status Updated`,
            text: `
Hi ${username},

This is to inform you that the status of your automation "${instanceName}" has been updated to "${newStatus}".

If you did not request this change or need assistance, please contact the Automation App owner or support team immediately.

Best regards,
Automation App Team
      `,
        });
        console.log(`Automation status update email sent to ${email}`);
    }
    catch (error) {
        console.error("Error sending automation status update email:", error);
    }
};
exports.sendAutomationStatusUpdateEmail = sendAutomationStatusUpdateEmail;
