import { email_transporter, sender_email } from "../lib/nodemailer";

export const send_password_changed_email = async (user_email: string) => {
  try {
    await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: "Password Changed Successfully - Automation App",
      text: `
Dear User,

This is a confirmation that your password for Automation App has been successfully changed.

✅ If you performed this change, no further action is required.

⚠️ If you did NOT change your password, please **reset your password immediately** to secure your account.

Best regards,
The Automation App Team
      `,
    });

    console.log(`Password change confirmation email sent successfully to ${user_email}`);
  } catch (error) {
    console.error(`Error sending password change email:`, error);
  }
};
