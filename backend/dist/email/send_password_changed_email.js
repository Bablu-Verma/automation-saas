"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_password_changed_email = void 0;
const nodemailer_1 = require("../lib/nodemailer");
const send_password_changed_email = async (user_email) => {
    try {
        const subject = "🔒 Password Changed Successfully - LoopAxis";
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed - LoopAxis</title>
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
                                Security Notification
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
                    <!-- Security Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: #27ae60; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">🔒</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                Password Changed Successfully
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Confirmation Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0; text-align: center;">
                                This is a confirmation that your LoopAxis account password has been successfully updated.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Security Status Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #27ae60; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; text-align: center;">
                                            <span style="color: #27ae60; font-weight: bold;">✅</span> Your password has been successfully changed
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; text-align: center;">
                                            <span style="color: #27ae60; font-weight: bold;">🕒</span> Changed on: ${new Date().toLocaleString()}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; text-align: center;">
                                            <span style="color: #27ae60; font-weight: bold;">🌐</span> Your account security has been updated
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Action Required Section -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">⚠️ Important Security Notice</h3>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px;">
                                            <strong>✅ If you performed this change:</strong><br>
                                            No further action is required. You can continue using your account normally.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px;">
                                            <strong>🚨 If you did NOT change your password:</strong><br>
                                            Your account security may be compromised. Please take immediate action.
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    
                    <!-- Security Tips -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
                                <h3 style="color: #131D4F; margin: 0 0 15px 0; font-size: 16px;">🔐 Security Best Practices</h3>
                                <ul style="color: #131D4F; font-size: 13px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Use a strong, unique password for your account</li>
                                    <li>Enable two-factor authentication if available</li>
                                    <li>Never share your password with anyone</li>
                                    <li>Regularly update your password</li>
                                </ul>
                            </div>
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
                            <a href="https://loopaxis.babluverma.site/security" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Security</a>
                            <a href="https://loopaxis.babluverma.site/help" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Help Center</a>
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
        const info = await nodemailer_1.email_transporter.sendMail({
            from: `LoopAxis Security <${nodemailer_1.sender_email}>`,
            to: user_email,
            subject,
            html,
        });
        console.log("Password change confirmation email sent successfully to:", user_email);
        return info;
    }
    catch (error) {
        console.error("Error sending password change email:", error);
        throw error;
    }
};
exports.send_password_changed_email = send_password_changed_email;
