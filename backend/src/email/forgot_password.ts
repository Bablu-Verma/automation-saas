import { email_transporter, sender_email } from "../lib/nodemailer";

export const send_password_reset_email = async (resetLink: string, user_email: string) => {

  console.log('email fun run')

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
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Dear User,</p>
                <p>We received a request to reset your password. Please click the button below to set a new password:</p>
                <p style="text-align: center;">
                  <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px;">Reset Password</a>
                </p>
                <p>This link is valid for 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,<br/>The Automation App Team</p>
              </div>
            `
        });
        console.log(`Message sent`, info);
    } catch (error) {
        console.log(`Error sending email:`, error);
    }
};

