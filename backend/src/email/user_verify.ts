import { email_transporter, sender_email } from "../lib/nodemailer";

export const user_verify_email = async (otp: string, user_email: string) => {
  try {
    const subject = "🔐 Verify Your Email -  Taskzeno";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification -  Taskzeno</title>
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
                                Task<span style="color: #E6521F;">Zeno</span>
                            </h1>
                            <p style="color: #E6521F; font-size: 16px; margin: 8px 0 0 0; font-weight: 500;">
                                Email Verification
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
                    <!-- Verification Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: #E6521F; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">🔐</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                Verify Your Email Address
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0; text-align: center;">
                                Thank you for signing up with taskzeno! To complete your registration, please verify your email address using the OTP below.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- OTP Display Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background: linear-gradient(135deg, #131D4F, #E6521F); padding: 30px; border-radius: 12px; text-align: center; box-shadow: 0 8px 25px rgba(19, 29, 79, 0.15);">
                                <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                    Your Verification Code
                                </h3>
                                <div style="background-color: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 10px; border: 2px dashed rgba(255, 255, 255, 0.3);">
                                    <p style="color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
                                        ${otp}
                                    </p>
                                </div>
                                <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 15px 0 0 0;">
                                    This code expires in 10 minutes
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Instructions -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">📝 How to Use This Code</h3>
                                <ol style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Return to the taskzeno verification page</li>
                                    <li>Enter the 6-digit code shown above</li>
                                    <li>Click "Verify Email" to complete registration</li>
                                    <li>You'll be redirected to your dashboard upon success</li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Security Warning -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff5f5; padding: 20px; border-radius: 8px; border: 1px solid #e74c3c;">
                                <h3 style="color: #e74c3c; margin: 0 0 15px 0; font-size: 16px;">🚨 Important Security Notice</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Never share this OTP with anyone</li>
                                    <li>taskzeno team will never ask for your OTP</li>
                                    <li>This code is valid for 10 minutes only</li>
                                    <li>Delete this email after verification</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Troubleshooting -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                                <h3 style="color: #131D4F; margin: 0 0 15px 0; font-size: 16px;">❓ Need Help?</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>If you didn't request this code, please ignore this email</li>
                                    <li>Code not working? Wait for 10 minutes and request a new one</li>
                                    <li>Having trouble verifying? <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none;">Contact our support team</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
                                <p style="color: #27ae60; font-size: 14px; font-weight: bold; margin: 0;">
                                    Once verified, you'll get full access to taskzeno Automation features! 🚀
                                </p>
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
                               Taskzeno Automation Platform
                            </p>
                        </td>
                    </tr>
                   
                    <tr>
                        <td align="center" style="padding-bottom: 15px;">
                            <p style="color: #bdc3c7; font-size: 12px; margin: 0 0 10px 0;">
                                Email: <a href="mailto:taskzenoautomat@gmail.com" style="color: #E6521F; text-decoration: none;">taskzenoautomat@gmail.com</a> | 
                                Website: <a href="https://taskzeno.babluverma.site/" style="color: #E6521F; text-decoration: none;">taskzeno.babluverma.site</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <p style="color: #bdc3c7; font-size: 11px; margin: 0 0 8px 0;">
                                &copy; 2024 taskzeno Automation. All rights reserved.
                            </p>
                            <p style="color: #bdc3c7; font-size: 11px; margin: 0;">
                                <a href="https://taskzeno.babluverma.site/terms" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                                <span style="color: #E6521F;">|</span>
                                <a href="https://taskzeno.babluverma.site/privacy" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
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
      from: `taskzeno Verification <${sender_email}>`,
      to: user_email,
      subject,
      html
    });

    console.log("Verification email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};