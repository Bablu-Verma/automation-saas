import { email_transporter, sender_email } from "../lib/nodemailer";

export const sendInvoiceEmail = async (
  user: any,
  pdfBuffer: Buffer, 
  payment: any
) => {
  try {
    const subject = `🧾 Invoice #${payment.orderId} -  Taskzeno`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice -  Taskzeno</title>
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
                                Invoice Generated
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
                    <!-- Invoice Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: #27ae60; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">🧾</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                Invoice Generated Successfully
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Hello <strong style="color: #E6521F;">${user.name}</strong>,
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Thank you for your payment! Your invoice has been generated and is ready for download.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Invoice Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #27ae60; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Invoice Number:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; font-weight: 600;">${payment.orderId}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Amount Paid:</td>
                                        <td style="padding: 12px 0; color: #27ae60; font-size: 18px; font-weight: bold;">
                                            ${payment.amountDetails?.totalAmount || 0} ${payment.currency || 'INR'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Payment Date:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            ${new Date(payment.createdAt).toLocaleDateString('en-IN', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Payment Method:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">
                                            ${payment.paymentMethod || 'Online Payment'}
                                        </td>
                                    </tr>
                                  
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Additional Payment Details -->
                    ${payment.instanceId ? `
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">📋 Service Details</h3>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 8px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Automation:</td>
                                        <td style="padding: 8px 0; color: #131D4F; font-size: 14px;">
                                            ${payment.instanceId.instanceName || 'Automation Service'}
                                        </td>
                                    </tr>
                                    ${payment.amountDetails?.taxAmount ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Tax Amount:</td>
                                        <td style="padding: 8px 0; color: #131D4F; font-size: 14px;">
                                            ${payment.amountDetails.taxAmount} ${payment.currency || 'INR'}
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${payment.amountDetails?.discount ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Discount:</td>
                                        <td style="padding: 8px 0; color: #27ae60; font-size: 14px;">
                                            -${payment.amountDetails.discount} ${payment.currency || 'INR'}
                                        </td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Download Instructions -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                                <h3 style="color: #131D4F; margin: 0 0 15px 0; font-size: 16px;">📥 Download Your Invoice</h3>
                                <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Your detailed invoice is attached to this email as a PDF file. 
                                    You can download and save it for your records.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Buttons -->
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://taskzeno.babluverma.site/dashboard/billing" 
                                           style="background-color: #E6521F; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            View All Invoices
                                        </a>
                                        <a href="https://taskzeno.babluverma.site/dashboard" 
                                           style="background-color: #131D4F; color: white; padding: 14px 32px; 
                                                  text-decoration: none; border-radius: 6px; font-weight: bold; 
                                                  font-size: 15px; display: inline-block; margin: 5px;">
                                            Go to Dashboard
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
                                Need help with your invoice or have questions about your payment? 
                                <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none;">Contact our support team</a> 
                                for assistance.
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
                            <a href="https://taskzeno.babluverma.site/billing" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Billing</a>
                            <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Support</a>
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
      from: `taskzeno Billing <${sender_email}>`,
      to: user.email,
      subject,
      html,
      attachments: [
        {
          filename: `invoice-${payment.orderId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        },
      ],
    });

    console.log("Invoice email sent successfully to:", user.email);
    return info;
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};