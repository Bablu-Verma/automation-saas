import { email_transporter, sender_email } from "../lib/nodemailer";

export const send_newsletter_subscription_email = async (user_email: string) => {
  try {
    const subject = "🎉 Welcome to Taskzeno Newsletter!";
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Newsletter -  Taskzeno</title>
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
                                Newsletter Subscription Confirmed
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
                    <!-- Welcome Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: #E6521F; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">🎉</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                Welcome to Our Community!
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0; text-align: center;">
                                Thank you for subscribing to thetaskzeno Newsletter!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Benefits Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #E6521F; border: 1px solid #e9ecef;">
                                <h3 style="color: #131D4F; margin: 0 0 20px 0; font-size: 18px; text-align: center;">
                                    Here's What You'll Receive:
                                </h3>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            <span style="color: #E6521F; font-weight: bold;">🚀</span> Latest automation trends & insights
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            <span style="color: #E6521F; font-weight: bold;">💡</span> Expert tips & best practices
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            <span style="color: #E6521F; font-weight: bold;">📢</span> Product updates & new features
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            <span style="color: #E6521F; font-weight: bold;">🎯</span> Exclusive tutorials & guides
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            <span style="color: #E6521F; font-weight: bold;">⚡</span> Industry news & automation success stories
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Expectation -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">📬 What to Expect</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Curated content delivered to your inbox</li>
                                    <li>Monthly updates with the most valuable insights</li>
                                    <li>No spam - only quality content</li>
                                    <li>Easy unsubscribe option in every email</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Buttons -->
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                      
                                        <a href="https://taskzeno.babluverma.site/services" 
                                           style="background-color: #131D4F; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            Explore Automations
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
                               Taskzeno Automation Platform
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <a href="https://taskzeno.babluverma.site/" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Home</a>
                            <a href="https://taskzeno.babluverma.site/blog" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Blog</a>
                            <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Contact</a>
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
      from: `taskzeno Newsletter <${sender_email}>`,
      to: user_email,
      subject,
      html,
     
    });

    console.log("Newsletter subscription email sent successfully to:", user_email);
    return info;
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    throw error;
  }
};