import { email_transporter, sender_email } from "../lib/nodemailer";

/**
 * 1️⃣ User Delete Request Email
 */
export const user_delete_request_email = async (user_email: string, user_name: string) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Account Deletion Request Received",
      text: `
        Dear ${user_name},

        We have received your request to delete your account.

        Your account deletion will be processed shortly. If you did not request this deletion, please contact our support team immediately to secure your account.

        Best regards,
        Automation App Team
      `
    });

    console.log("Delete request email sent:", info);
  } catch (error) {
    console.log("Error sending delete request email:", error);
  }
};

/**
 * 2️⃣ User Delete Success Email
 */
export const user_delete_success_email = async (user_email: string, user_name: string) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Account Successfully Deleted",
      text: `
        Dear ${user_name},

        Your account has been successfully deleted from Automation App.

        We're sorry to see you go! If this was a mistake or you wish to join us again in the future, feel free to sign up anytime.

        Best regards,
        Automation App Team
      `
    });

    console.log("Delete success email sent:", info);
  } catch (error) {
    console.log("Error sending delete success email:", error);
  }
};
