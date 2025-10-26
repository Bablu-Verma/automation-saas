import { email_transporter, sender_email } from "../lib/nodemailer";


export const sendAutomationStatusUpdateEmail = async (
  email: string,
  username: string,
  instanceName: string,
  newStatus: string
) => {
  try {
    await email_transporter.sendMail({
      from: sender_email,
      to: email,
      subject: `Your Automation "${instanceName}" Status Updated`,
      text: `
Hi ${username},

This is to inform you that the status of your automation "${instanceName}" has been updated to "${newStatus}".

If you did not request this change or need assistance, please contact the Automation App owner or support team immediately.

Best regards,
Automation App Team
      `,
    });

    console.log(`Automation status update email sent to ${email}`);
  } catch (error) {
    console.error("Error sending automation status update email:", error);
  }
};
