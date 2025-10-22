import { email_transporter, sender_email } from "../lib/nodemailer";

export const payment_request_success_email = async (
  user_email: string,
  amount: number,
  currency: string,
  request_id: string
) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: `Payment Request #${request_id} Created Successfully`,
      text: `
        Dear User,

        Your payment request has been successfully created.

        Details:
        - Request ID: ${request_id}
        - Amount: ${amount} ${currency}

        You can view and manage this payment request from your dashboard.

        Thank you for using Automation App!

        Best regards,
        Automation App Team
      `
    });

    console.log("Payment request success email sent:", info);
  } catch (error) {
    console.log("Error sending payment request email:", error);
  }
};
