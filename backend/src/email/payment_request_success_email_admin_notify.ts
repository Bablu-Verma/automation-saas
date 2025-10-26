import { email_transporter, sender_email } from "../lib/nodemailer";

export const payment_request_success_email_admin_notify = async (
  amount: number,
  currency: string,
  request_id: string
) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: "babluverma@gmail.com", // Admin email
      subject: `Payment Request #${request_id} Created Successfully`,
      text: `
Hello Admin,

A new payment request has been successfully created in the Automation App.

Details:
- Request ID: ${request_id}
- Amount: ${amount} ${currency}

You can view and manage this request from the admin dashboard.

Thank you,
Automation App Team
      `,
    });

    console.log("Payment request success email sent:", info);
  } catch (error) {
    console.error("Error sending payment request email:", error);
  }
};
