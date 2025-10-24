import { email_transporter, sender_email } from "../lib/nodemailer";


/**
 * Send email to user when payment status is updated by admin
 */
export const sendPaymentStatusEmail = async (
  userEmail: string,
  userName: string,
  payment:any
) => {
  try {
    const subject = `Payment Request #${payment.orderId} Status Updated`;
    
    const text = `
Hi ${userName},

This is to inform you that your payment request (Order ID: ${payment.orderId}) for "${payment.instanceId.instanceName}" has been updated by the admin.

Current Status: ${payment.status.toUpperCase()}
Amount: ${payment.amountDetails.totalAmount} ${payment.currency}
Payment Method: ${payment.paymentMethod}

${payment.note ? `Note: ${payment.note}` : ""}

If you have any questions, please contact the Automation App owner or support team.

Best regards,
Automation App Team
    `;

    await email_transporter.sendMail({
      from: sender_email,
      to: userEmail,
      subject,
      text,
    });

    console.log(`Payment status email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending payment status email:", error);
  }
};
