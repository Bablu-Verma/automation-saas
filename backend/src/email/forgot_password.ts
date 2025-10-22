import { email_transporter, sender_email } from "../lib/nodemailer";

export const send_password_reset_email = async (resetLink: string, user_email: string) => {


  console.log("resetLink==",resetLink)

    try {
      const info = await email_transporter.sendMail({
            from: sender_email,
            to: user_email,
            subject: "Password Reset Request",
            text: `
              Dear User,

              We received a request to reset your password. Please copy and paste the following link into your browser to complete the process:
              ${resetLink}

              This link is valid for 20 minutes. If you did not request this, please ignore this email.

              Best regards,
              The Automation App Team
            `,
        });
        // console.log(`Message sent`, info);
    } catch (error) {
        console.log(`Error sending email:`, error);
    }
};

