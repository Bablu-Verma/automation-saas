import { email_transporter, sender_email } from "../lib/nodemailer";

/**
 * Send email to user about their automation expiration
 */
export const sendAutomationExpirationEmail = async (
  email: string,
  username: string,
  instanceName: string,
  status: "EXPIRE_SOON" | "EXPIRED"
) => {
  try {
    const isExpiringSoon = status === "EXPIRE_SOON";
    
    const subject = isExpiringSoon 
      ? `⚠️ Automation "${instanceName}" Expiring Soon -  Taskzeno`
      : `❌ Automation "${instanceName}" Has Expired -  Taskzeno`;

    const statusConfig = {
      EXPIRE_SOON: {
        color: "#f39c12",
        icon: "⚠️",
        title: "Automation Expiring Soon",
        statusText: "EXPIRING SOON",
        urgency: "medium"
      },
      EXPIRED: {
        color: "#e74c3c",
        icon: "❌",
        title: "Automation Expired",
        statusText: "EXPIRED",
        urgency: "high"
      }
    };

    const config = statusConfig[status];

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automation ${isExpiringSoon ? 'Expiring Soon' : 'Expired'} -  Taskzeno</title>
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
                                ${config.title}
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
                    <!-- Status Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: ${config.color}; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">${config.icon}</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                ${isExpiringSoon ? 'Automation Expiring Soon' : 'Automation Has Expired'}
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Hello <strong style="color: #E6521F;">${username}</strong>,
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                ${isExpiringSoon 
                                  ? `We wanted to inform you that your automation will expire soon. Take action to avoid service interruption.`
                                  : `Your automation has expired and is currently paused. Reactivate it to resume service.`
                                }
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Automation Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid ${config.color}; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Automation Name:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; font-weight: 600;">${instanceName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Status:</td>
                                        <td style="padding: 12px 0;">
                                            <span style="background-color: ${config.color}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                                                ${config.statusText}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Notification:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            ${isExpiringSoon ? 'Expiring Soon - Action Required' : 'Expired - Service Paused'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Date:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Action Required -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">${isExpiringSoon ? '🚀 Recommended Action' : '🔄 Reactivation Required'}</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    ${isExpiringSoon 
                                      ? `
                                        <li>Renew your automation to continue uninterrupted service</li>
                                        <li>Update billing information if needed</li>
                                        <li>Contact support for assistance with renewal</li>
                                        <li>Review your automation settings</li>
                                      `
                                      : `
                                        <li>Reactivate your automation to resume service</li>
                                        <li>Check your subscription status</li>
                                        <li>Update payment method if required</li>
                                        <li>Contact support for reactivation help</li>
                                      `
                                    }
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
                                        <a href="https://taskzeno.babluverma.site/dashboard/automations" 
                                           style="background-color: ${isExpiringSoon ? '#E6521F' : '#e74c3c'}; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            ${isExpiringSoon ? 'Renew Automation' : 'Reactivate Now'}
                                        </a>
                                        <a href="https://taskzeno.babluverma.site/dashboard" 
                                           style="background-color: #131D4F; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            View Dashboard
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Support Info -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0;">
                                Need assistance? Our support team is here to help you 
                                <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none;">get back on track</a>.
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
                               Taskzeno Automation Platform
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <a href="https://taskzeno.babluverma.site/" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Home</a>
                            <a href="https://taskzeno.babluverma.site/pricing" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Pricing</a>
                            <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Support</a>
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
      from: `taskzeno Automations <${sender_email}>`,
      to: email,
      subject,
      html,
    });

    console.log(`Automation expiration email sent to ${email} for status ${status}`);
    return info;
  } catch (error) {
    console.error("Error sending automation expiration email:", error);
    throw error;
  }
};