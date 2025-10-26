import { email_transporter, sender_email } from "../lib/nodemailer";

export const user_profile_update_email = async (user_email: string, user_name: string) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Profile Updated Successfully",
      text: `
        Dear ${user_name},

        We wanted to let you know that your profile has been updated successfully.

        If you did not make this change or notice any suspicious activity, please contact our support team immediately.

        Thank you for keeping your information up to date!

        Best regards,
        Automation App Team
      `
    });

    console.log("Profile update email sent successfully:", info);
  } catch (error) {
    console.log("Error sending profile update email:", error);
  }
};
