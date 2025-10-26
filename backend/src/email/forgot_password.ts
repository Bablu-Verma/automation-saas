import { email_transporter, sender_email } from "../lib/nodemailer";

export const send_password_reset_email = async (resetLink: string, user_email: string) => {


  try {
    const subject = "🔒 Password Reset Request - LoopAxis";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - LoopAxis</title>
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
                                Password Reset Request
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
                            <div style="background-color: #E6521F; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">🔒</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                Password Reset Request
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                We received a request to reset your LoopAxis account password. Click the button below to create a new password.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Reset Button -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <a href="${resetLink}" 
                               style="background-color: #E6521F; color: white; padding: 16px 40px; 
                                      text-decoration: none; border-radius: 30px; font-weight: bold; 
                                      font-size: 16px; display: inline-block; margin: 10px 0;">
                                Reset Your Password
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Link Backup -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px dashed #E6521F;">
                                <p style="color: #131D4F; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
                                    🔗 Can't click the button? Copy and paste this link in your browser:
                                </p>
                                <p style="color: #E6521F; font-size: 13px; margin: 0; word-break: break-all; background-color: #fff9f7; padding: 10px; border-radius: 4px;">
                                    ${resetLink}
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Important Information -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">⚠️ Important Information</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>This password reset link is valid for <strong>20 minutes only</strong></li>
                                    <li>Do not share this link with anyone</li>
                                    <li>If you didn't request this reset, please ignore this email</li>
                                
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Support Info -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0;">
                                If you're having trouble resetting your password or have any security concerns, 
                                please contact our support team immediately.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Support Button -->
                    <tr>
                        <td align="center" style="padding-bottom: 10px;">
                            <a href="https://loopaxis.babluverma.site/contact" 
                               style="background-color: #131D4F; color: white; padding: 12px 25px; 
                                      text-decoration: none; border-radius: 5px; font-weight: bold; 
                                      font-size: 14px; display: inline-block;">
                                Contact Support
                            </a>
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

    const info = await email_transporter.sendMail({
      from: `LoopAxis Security <${sender_email}>`,
      to: user_email,
      subject,
      html,
   
    });

    console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};