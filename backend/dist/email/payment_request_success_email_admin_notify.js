"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment_request_success_email_admin_notify = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const payment_request_success_email_admin_notify = async (amount, currency, request_id) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: "babluverma@gmail.com", // Admin email
            subject: `Payment Request #${request_id} Created Successfully`,
            text: `
Hello Admin,

A new payment request has been successfully created in the Automation App.

Details:
- Request ID: ${request_id}
- Amount: ${amount} ${currency}

You can view and manage this request from the admin dashboard.

Thank you,
Automation App Team
      `,
        });
        console.log("Payment request success email sent:", info);
    }
    catch (error) {
        console.error("Error sending payment request email:", error);
    }
};
exports.payment_request_success_email_admin_notify = payment_request_success_email_admin_notify;
