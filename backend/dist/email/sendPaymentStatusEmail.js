"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentStatusEmail = void 0;
const nodemailer_1 = require("../lib/nodemailer");
/**
 * Send email to user when payment status is updated by admin
 */
const sendPaymentStatusEmail = async (userEmail, userName, payment) => {
    try {
        const subject = `Payment Request #${payment.orderId} Status Updated`;
        const text = `
Hi ${userName},

This is to inform you that your payment request (Order ID: ${payment.orderId}) for "${payment.instanceId.instanceName}" has been updated by the admin.

Current Status: ${payment.status.toUpperCase()}
Amount: ${payment.amountDetails.totalAmount} ${payment.currency}
Payment Method: ${payment.paymentMethod}

${payment.note ? `Note: ${payment.note}` : ""}

If you have any questions, please contact the Automation App owner or support team.

Best regards,
Automation App Team
    `;
        await nodemailer_1.email_transporter.sendMail({
            from: nodemailer_1.sender_email,
            to: userEmail,
            subject,
            text,
        });
        console.log(`Payment status email sent to ${userEmail}`);
    }
    catch (error) {
        console.error("Error sending payment status email:", error);
    }
};
exports.sendPaymentStatusEmail = sendPaymentStatusEmail;
