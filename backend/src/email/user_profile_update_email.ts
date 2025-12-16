import { email_transporter, sender_email } from "../lib/nodemailer";

export const user_profile_update_email = async (user_email: string, user_name: string) => {
  try {
    const subject = "👤 Profile Updated Successfully -  Taskzeno";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Updated -  Taskzeno</title>
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
                                Profile Update Confirmation
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
                    <!-- Success Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: #27ae60; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">✅</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                Profile Updated Successfully
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Hello <strong style="color: #E6521F;">${user_name}</strong>,
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                We wanted to let you know that your taskzeno profile has been updated successfully.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Update Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #27ae60; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Action:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">Profile Information Updated</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Status:</td>
                                        <td style="padding: 12px 0;">
                                            <span style="background-color: #27ae60; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                                                SUCCESSFUL
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Updated On:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">${new Date().toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Account:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">${user_email}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">🔒 Security Check</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>If you made this change, no further action is needed</li>
                                    <li>If you did NOT make this change, please contact support immediately</li>
                                    <li>Review your recent account activity for any suspicious actions</li>
                                    <li>Consider updating your password if you suspect unauthorized access</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Benefits of Updated Profile -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                                <h3 style="color: #131D4F; margin: 0 0 15px 0; font-size: 16px;">🎯 Benefits of Updated Profile</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Better personalized experience</li>
                                    <li>Accurate communication and notifications</li>
                                    <li>Improved security with up-to-date information</li>
                                    <li>Enhanced automation performance</li>
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
                                        <a href="https://taskzeno.babluverma.site/dashboard/profile" 
                                           style="background-color: #E6521F; color: white; padding: 12px 25px; 
                                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                                  font-size: 14px; display: inline-block; margin: 5px;">
                                            View Updated Profile
                                        </a>
                                  
                                        <a href="https://taskzeno.babluverma.site/contact" 
                                           style="background-color: #3498db; color: white; padding: 12px 25px; 
                                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                                  font-size: 14px; display: inline-block; margin: 5px;">
                                            Contact Support
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Appreciation -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
                                <p style="color: #27ae60; font-size: 14px; font-weight: bold; margin: 0;">
                                    Thank you for keeping your information up to date! 🎉
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
                                Email: <a href="mailto:taskzeno@gmail.com" style="color: #E6521F; text-decoration: none;">taskzeno@gmail.com</a> | 
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
      from: `taskzeno Profile <${sender_email}>`,
      to: user_email,
      subject,
      html,
   
    });

    console.log("Profile update email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending profile update email:", error);
    throw error;
  }
};