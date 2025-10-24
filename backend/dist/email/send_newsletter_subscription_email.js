"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_newsletter_subscription_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const send_newsletter_subscription_email = async (user_email) => {
    try {
        await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: "Welcome to Automation App Newsletter",
            text: `
Hi there,

Thank you for subscribing to the Automation App Newsletter!

You’ll now receive the latest updates, tips, and news directly in your inbox. 

We’re excited to keep you informed and engaged.

If you did not subscribe to this newsletter, please ignore this email.

Best regards,
The Automation App Team
      `,
        });
        console.log(`Newsletter subscription email sent successfully to ${user_email}`);
    }
    catch (error) {
        console.error(`Error sending newsletter email:`, error);
    }
};
exports.send_newsletter_subscription_email = send_newsletter_subscription_email;
