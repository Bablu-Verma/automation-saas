"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payment_request_success_email_admin_notify = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const payment_request_success_email_admin_notify = async (amount, currency, request_id) => {
    try {
        const subject = `💰 New Payment Request #${request_id} - Action Required`;
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Payment Request - LoopAxis</title>
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
                                Admin Notification - New Payment Request
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
                    <!-- Notification Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: #E6521F; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">💰</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                New Payment Request Received
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Hello Admin,<br>
                                A new payment request has been successfully created and requires your attention.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Payment Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #E6521F; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Request ID:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; font-weight: 600;">${request_id}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Amount:</td>
                                        <td style="padding: 12px 0; color: #27ae60; font-size: 16px; font-weight: bold;">
                                            ${amount} ${currency}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Status:</td>
                                        <td style="padding: 12px 0;">
                                            <span style="background-color: #f39c12; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                                                PENDING REVIEW
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Submitted On:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Action Required -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">📋 Action Required</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Review the payment request details</li>
                                    <li>Verify the amount and user information</li>
                                    <li>Approve or reject the request as appropriate</li>
                                    <li>Notify the user once action is taken</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Quick Actions -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">
                                <strong>🚀 Quick Actions:</strong>
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="https://loopaxis.babluverma.site/admin/billing" 
                                           style="background-color: #E6521F; color: white; padding: 12px 25px; 
                                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                                  font-size: 14px; display: inline-block; margin: 5px;">
                                            View Payment Dashboard
                                        </a>
                                       
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Additional Info -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <p style="color: #131D4F; font-size: 12px; line-height: 1.6; margin: 0;">
                                <strong>Note:</strong> This is an automated notification. Please process this request within 24 hours.
                            </p>
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
                            <a href="https://loopaxis.babluverma.site/admin" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Admin Panel</a>
                            <a href="https://loopaxis.babluverma.site/" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Website</a>
                            <a href="https://loopaxis.babluverma.site/contact" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Support</a>
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
                                <a href="https://loopaxis.babluverma.site/terms" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Terms</a>
                                <span style="color: #E6521F;">|</span>
                                <a href="https://loopaxis.babluverma.site/privacy" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Privacy</a>
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
        const info = await nodemailer_1.email_transporter.sendMail({
            from: `LoopAxis System <${nodemailer_1.sender_email}>`,
            to: "babluverma@gmail.com",
            subject,
            html,
        });
        console.log("Payment request success email sent to admin:", info.messageId);
        return info;
    }
    catch (error) {
        console.error("Error sending payment request email to admin:", error);
        throw error;
    }
};
exports.payment_request_success_email_admin_notify = payment_request_success_email_admin_notify;
