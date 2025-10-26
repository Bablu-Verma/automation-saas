import { email_transporter, sender_email } from "../lib/nodemailer";

export const contact_form_submission_email = async (
  user_email: string,
  user_name: string,
  message_subject: string,
) => {
  try {
    const subject = `📧 We've Received Your Message - LoopAxis Support`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Received - LoopAxis</title>
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
                                Message Successfully Received
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
                            <div style="background-color: #3498db; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">✉️</span>
                            </div>
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
                                Thank you for reaching out to us! We have successfully received your message and our support team will get back to you as soon as possible.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #3498db; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="35%" style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Subject:</td>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px; font-weight: 500;">${message_subject}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Submitted On:</td>
                                        <td style="padding: 10px 0; color: #131D4F; font-size: 14px;">${new Date().toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Status:</td>
                                        <td style="padding: 10px 0;">
                                            <span style="background-color: #3498db; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                                                UNDER REVIEW
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- What Happens Next -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">📋 What Happens Next?</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    <li>Our support team will review your message within 24 hours</li>
                                    <li>You'll receive a personalized response from our expert</li>
                                    <li>We'll work with you to resolve your query</li>
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Response Time -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0;">
                                <strong>Typical Response Time:</strong> 1-2 business days<br>
                                <strong>Urgent Matters:</strong> For immediate assistance, please call our support line
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Additional Resources -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                                <strong>💡 Quick Resources:</strong>
                            </p>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="https://loopaxis.babluverma.site/faq" 
                                           style="background-color: #3498db; color: white; padding: 10px 20px; 
                                                  text-decoration: none; border-radius: 5px; font-weight: bold; 
                                                  font-size: 13px; display: inline-block; margin: 3px;">
                                            FAQ
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

    
    const info = await email_transporter.sendMail({
      from: `LoopAxis Support <${sender_email}>`,
      to: user_email,
      subject,
      html,
     
    });

    console.log("Contact form submission email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
};