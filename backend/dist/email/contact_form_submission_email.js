"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact_form_submission_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const contact_form_submission_email = async (user_email, user_name, message_subject) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: `We Received Your Message`,
            text: `
        Dear ${user_name},

        Thank you for reaching out to us. We have received your message and our support team will get back to you as soon as possible.

        Your Subject:
        "${message_subject}"

        We appreciate your feedback and will do our best to assist you promptly.

        Best regards,
        Automation App Team
      `
        });
        console.log("Contact form submission email sent:", info);
    }
    catch (error) {
        console.log("Error sending contact form email:", error);
    }
};
exports.contact_form_submission_email = contact_form_submission_email;
