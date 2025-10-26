"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaymentStatusEmail = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const sendPaymentStatusEmail = async (userEmail, userName, payment) => {
    try {
        const subject = `💰 Payment Request #${payment.orderId} Status - ${payment.status.toUpperCase()}`;
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Status Update - LoopAxis</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td align="center" bgcolor="#131D4F" style="padding: 30px 20px; border-radius: 10px 10px 0 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                                Loop<span style="color: #E6521F;">Axis</span>
                            </h1>
                            <p style="color: #E6521F; font-size: 16px; margin: 8px 0 0 0; font-weight: 500;">
                                Payment Status Update
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px 30px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- Greeting -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Hello <strong style="color: #E6521F;">${userName}</strong>,
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Your payment request status has been updated. Here are the details:
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Payment Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #E6521F; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Order ID:</td>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px;">${payment.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Instance Name:</td>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px;">${payment.instanceId.instanceName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Status:</td>
                                        <td style="padding: 10px 0;">
                                            <span style="background-color: gray; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                                                ${payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Amount:</td>
                                        <td style="padding: 10px 0; color: #27ae60; font-weight: bold; font-size: 14px;">
                                            ${payment.amountDetails.totalAmount} ${payment.currency}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Payment Method:</td>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px;">${payment.paymentMethod}</td>
                                    </tr>
                                    ${payment.note ? `
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Admin Note:</td>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px; font-style: italic; background-color: #fff9f7; padding: 8px; border-radius: 4px; border-left: 3px solid #E6521F;">
                                            ${payment.note}
                                        </td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Additional Info -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0;">
                                If you have any questions or concerns regarding this payment status, 
                                please don't hesitate to contact our support team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Support CTA -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://loopaxis.babluverma.site/contact" 
                                           style="background-color: #E6521F; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            Contact Support
                                        </a>
                                        <a href="https://loopaxis.babluverma.site/" 
                                           style="background-color: #131D4F; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            Visit Website
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td bgcolor="#131D4F" style="padding: 30px 20px; border-radius: 0 0 10px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <p style="color: #ffffff; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">
                                LoopAxis Automation Platform
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <a href="https://loopaxis.babluverma.site/" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Home</a>
                            <a href="https://loopaxis.babluverma.site/about" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">About</a>
                            <a href="https://loopaxis.babluverma.site/contact" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Contact</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 15px;">
                            <p style="color: #bdc3c7; font-size: 12px; margin: 0 0 10px 0;">
                                Email: <a href="mailto:loopaxisautomation@gmail.com" style="color: #E6521F; text-decoration: none;">loopaxisautomation@gmail.com</a> | 
                                Website: <a href="https://loopaxis.babluverma.site/" style="color: #E6521F; text-decoration: none;">loopaxis.babluverma.site</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <p style="color: #bdc3c7; font-size: 11px; margin: 0 0 8px 0;">
                                &copy; 2024 LoopAxis Automation. All rights reserved.
                            </p>
                            <p style="color: #bdc3c7; font-size: 11px; margin: 0;">
                                <a href="https://loopaxis.babluverma.site/terms" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                                <span style="color: #E6521F;">|</span>
                                <a href="https://loopaxis.babluverma.site/privacy" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
        await nodemailer_1.email_transporter.sendMail({
            from: `LoopAxis <${nodemailer_1.sender_email}>`,
            to: userEmail,
            subject,
            html,
        });
        console.log(`Payment status email sent to ${userEmail}`);
    }
    catch (error) {
        console.error("Error sending payment status email:", error);
        throw error;
    }
};
exports.sendPaymentStatusEmail = sendPaymentStatusEmail;
