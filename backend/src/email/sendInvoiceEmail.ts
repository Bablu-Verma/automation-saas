import { email_transporter, sender_email } from "../lib/nodemailer";

export const sendInvoiceEmail = async (user:any
  , pdfBuffer: Buffer, payment: any
) => {
  try {
    const info = await email_transporter.sendMail({
      from: sender_email,
       to: user.email,
      subject: `Invoice #${payment.orderId} -Loop Axis.in `,
     html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Invoice Generated</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for your payment. Your invoice #${payment.orderId} is ready for download.</p>
          <p><strong>Payment Details:</strong></p>
          <ul>
            <li>Amount: ${payment.amountDetails?.totalAmount || 0}</li>
            <li>Date: ${new Date(payment.createdAt).toLocaleDateString()}</li>
          </ul>
          <p>Please find your invoice attached to this email.</p>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <br>
          <p>Best regards,<br>LoopAxis.in</p>
        </div>
      `,
      attachments: [
       {
        filename: `invoice-${payment.orderId}.pdf`,
        content: pdfBuffer.toString('base64'), 
        contentType: 'application/pdf',
        encoding: 'base64' 
      },
    ],
    });
    console.log(pdfBuffer)
    console.log("Contact form submission email sent:", info);
  } catch (error) {
    console.log("Error sending contact form email:", error);
  }
};
