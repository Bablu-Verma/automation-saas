import { email_transporter, sender_email } from "../lib/nodemailer";

export const automation_create_success_email = async (
  user_email: string,
  user_name: string,
  automation_name: string
) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: `Automation "${automation_name}" Created Successfully`,
      text: `
        Dear ${user_name},

        Your automation "${automation_name}" has been successfully created.

        You can now view and manage this automation from your dashboard.

        Thank you for using Automation App!

        Best regards,
        Automation App Team
      `
    });

    console.log("Automation creation success email sent:", info);
  } catch (error) {
    console.log("Error sending automation creation email:", error);
  }
};
