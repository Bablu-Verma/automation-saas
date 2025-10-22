import { email_transporter, sender_email } from "../lib/nodemailer";

export const contact_form_submission_email = async (
  user_email: string,
  user_name: string,
  message_subject: string,
) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
      to: user_email,
      subject: `We Received Your Message`,
      text: `
        Dear ${user_name},

        Thank you for reaching out to us. We have received your message and our support team will get back to you as soon as possible.

        Your Subject:
        "${message_subject}"

        We appreciate your feedback and will do our best to assist you promptly.

        Best regards,
        Automation App Team
      `
    });

    console.log("Contact form submission email sent:", info);
  } catch (error) {
    console.log("Error sending contact form email:", error);
  }
};
