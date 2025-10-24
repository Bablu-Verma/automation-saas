"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAutomationExpirationEmail = void 0;
const nodemailer_1 = require("../lib/nodemailer");
/**
 * Send email to user about their automation expiration
 */
const sendAutomationExpirationEmail = async (email, username, instanceName, status) => {
    try {
        const subject = status === "EXPIRE_SOON"
            ? `Your Automation "${instanceName}" is expiring soon`
            : `Your Automation "${instanceName}" has expired`;
        const text = status === "EXPIRE_SOON"
            ? `
Hi ${username},

We wanted to inform you that your automation "${instanceName}" will expire soon. 

Please renew or take necessary action to avoid interruption.

Best regards,
Automation App Team
      `
            : `
Hi ${username},

Your automation "${instanceName}" has expired and is now paused.

If you wish to reactivate it or have any questions, please contact the Automation App owner or support team.

Best regards,
Automation App Team
      `;
        await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: email,
            subject,
            text,
        });
        console.log(`Automation expiration email sent to ${email} for status ${status}`);
    }
    catch (error) {
        console.error("Error sending automation expiration email:", error);
    }
};
exports.sendAutomationExpirationEmail = sendAutomationExpirationEmail;
