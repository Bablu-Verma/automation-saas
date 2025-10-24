"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment_request_success_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const payment_request_success_email = async (user_email, amount, currency, request_id) => {
    try {
        const info = await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: user_email,
            subject: `Payment Request #${request_id} Created Successfully`,
            text: `
        Dear User,

        Your payment request has been successfully created.

        Details:
        - Request ID: ${request_id}
        - Amount: ${amount} ${currency}

        You can view and manage this payment request from your dashboard.

        Thank you for using Automation App!

        Best regards,
        Automation App Team
      `
        });
        console.log("Payment request success email sent:", info);
    }
    catch (error) {
        console.log("Error sending payment request email:", error);
    }
};
exports.payment_request_success_email = payment_request_success_email;
