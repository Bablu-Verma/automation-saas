import { email_transporter, sender_email } from "../lib/nodemailer";

export const user_welcome_email = async (user_email: string, user_name: string) => {
  try {
    const subject = "🎉 Welcome to taskzeno - Let's Automate!";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to taskzeno</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td align="center" bgcolor="#131D4F" style="padding: 40px 20px; border-radius: 10px 10px 0 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold;">
                                Task<span style="color: #E6521F;">Zeno</span>
                            </h1>
                            <p style="color: #E6521F; font-size: 18px; margin: 10px 0 0 0; font-weight: 500;">
                                Welcome to Your Automation Journey!
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Hero Section -->
        <tr>
            <td bgcolor="#ffffff" style="padding: 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 40px 30px 30px 30px; background: linear-gradient(135deg, #fff9f7, #f8f9fa);">
                            <div style="background-color: #E6521F; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                                <span style="color: white; font-size: 48px;">🚀</span>
                            </div>
                            <h2 style="color: #131D4F; margin: 0 0 15px 0; font-size: 28px;">
                                Welcome aboard, ${user_name}!
                            </h2>
                            <p style="color: #131D4F; font-size: 18px; line-height: 1.6; margin: 0; max-width: 500px;">
                                We're absolutely thrilled to welcome you to taskzeno - where automation meets simplicity!
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td bgcolor="#ffffff" style="padding: 0 30px 30px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Thank you for choosing taskzeno to power your automation needs. Get ready to transform how you work and unlock new levels of productivity!
                            </p>
                        </td>
                    </tr>
                    
                   <!-- What You Can Do -->
<tr>
    <td style="padding-bottom: 30px;">
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; border-left: 4px solid #E6521F;">
            <h3 style="color: #131D4F; margin: 0 0 20px 0; font-size: 20px; text-align: center;">
                🎯 Here's What You Can Do Now
            </h3>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                        <span style="color: #E6521F; font-size: 20px; margin-right: 15px;">🚀</span>
                        <strong style="color: #131D4F;">Access Automation Services</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 0;">Get instant access to our premium automation services</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                        <span style="color: #E6521F; font-size: 20px; margin-right: 15px;">⚡</span>
                        <strong style="color: #131D4F;">Request New Services</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 0;">Submit requests for custom automation solutions</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 15px 0; border-bottom: 1px solid #e9ecef;">
                        <span style="color: #E6521F; font-size: 20px; margin-right: 15px;">📊</span>
                        <strong style="color: #131D4F;">Monitor Service Status</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 0;">Track your automation service performance and status</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 15px 0;">
                        <span style="color: #E6521F; font-size: 20px; margin-right: 15px;">🔧</span>
                        <strong style="color: #131D4F;">Manage Service Instances</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 0;">Handle multiple automation service instances efficiently</p>
                    </td>
                </tr>
            </table>
        </div>
    </td>
</tr>
                    
                    <!-- Getting Started Steps -->
                  <tr>
    <td style="padding-bottom: 25px;">
        <div style="background-color: #fff9f7; padding: 25px; border-radius: 10px; border: 2px solid #E6521F;">
            <h3 style="color: #E6521F; margin: 0 0 20px 0; font-size: 20px; text-align: center;">
                🚀 Quick Start Guide
            </h3>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td style="padding: 12px 0;">
                        <div style="background-color: #E6521F; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">1</div>
                        <strong style="color: #131D4F;">Complete Your Profile</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 35px;">Add your details to personalize your automation experience</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0;">
                        <div style="background-color: #E6521F; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</div>
                        <strong style="color: #131D4F;">Explore Our Automation Service</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 35px;">Discover the full range of automation features and capabilities</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 12px 0;">
                        <div style="background-color: #E6521F; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</div>
                        <strong style="color: #131D4F;">Integrate Your First Automation</strong>
                        <p style="color: #131D4F; font-size: 14px; margin: 5px 0 0 35px;">Set up and launch your first automateion</p>
                    </td>
                </tr>
            </table>
        </div>
    </td>
</tr>
                    
                    <!-- CTA Buttons -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://taskzeno.babluverma.site/dashboard" 
                                           style="background-color: #E6521F; color: white; padding: 16px 40px; 
                                                  text-decoration: none; border-radius: 8px; font-weight: bold; 
                                                  font-size: 16px; display: inline-block; margin: 8px; box-shadow: 0 4px 15px rgba(230, 82, 31, 0.3);">
                                            Launch Dashboard
                                        </a>
                                        
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
                                <h3 style="color: #27ae60; margin: 0 0 15px 0; font-size: 18px;">💫 We're Here to Help!</h3>
                                <p style="color: #131D4F; font-size: 15px; line-height: 1.6; margin: 0 0 15px 0;">
                                    Our support team is always ready to assist you on your automation journey.
                                </p>
                                <a href="https://taskzeno.babluverma.site/contact" 
                                   style="color: #E6521F; text-decoration: none; font-weight: bold; font-size: 15px;">
                                    Contact Support Team →
                                </a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Final Welcome -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <div style="text-align: center; padding: 20px;">
                                <p style="color: #131D4F; font-size: 16px; font-weight: bold; margin: 0;">
                                    Once again, welcome to the  family! 🎉
                                </p>
                                <p style="color: #7f8c8d; font-size: 14px; margin: 10px 0 0 0;">
                                    Let's build something amazing together!
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
      from: `taskzeno Team <${sender_email}>`,
      to: user_email,
      subject,
      html,
   
    });

    console.log("Welcome email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};