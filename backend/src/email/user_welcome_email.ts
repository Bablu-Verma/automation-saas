import { email_transporter, sender_email } from "../lib/nodemailer";

export const user_welcome_email = async (user_email: string, user_name: string) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Welcome to Automation App!",
      text: `
        Dear ${user_name},

        Welcome to Automation App! We're thrilled to have you on board.

        You can now explore all the features we offer and make the most out of our platform.

        If you have any questions, feel free to reach out to our support team.

        Best regards,
        Automation App Team
      `
    });

    console.log("Welcome email sent successfully:", info);
  } catch (error) {
    console.log("Error sending welcome email:", error);
  }
};
