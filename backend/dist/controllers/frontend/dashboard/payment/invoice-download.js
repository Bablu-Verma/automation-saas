"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceDownload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const sendInvoiceEmail_1 = require("../../../../email/sendInvoiceEmail");
const InvoiceDownload = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { paymentId } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID", success: false });
        }
        // 🔍 Fetch payment with population
        const payment = await Payment_1.default.findOne({ _id: paymentId, user: userId })
            .populate("user", "name email profile")
            .populate("instanceId", "instanceName")
            .lean();
        if (!payment) {
            return res.status(404).json({ message: "Payment not found", success: false });
        }
        // Generate PDF
        const pdfBuffer = await generateInvoicePDF(payment);
        //  const downloadsDir = path.join(process.cwd(), 'downloads');
        //   // Create downloads folder if it doesn't exist
        //   if (!fs.existsSync(downloadsDir)) {
        //     fs.mkdirSync(downloadsDir, { recursive: true });
        //   }
        //   const fileName = `invoice-${payment.orderId}-${Date.now()}.pdf`;
        //   const filePath = path.join(downloadsDir, fileName);
        //   fs.writeFileSync(filePath, pdfBuffer);
        //   console.log("✅ PDF saved locally:", filePath);
        //   console.log("📄 PDF file size:", pdfBuffer.length, "bytes");
        await (0, sendInvoiceEmail_1.sendInvoiceEmail)(payment.user, pdfBuffer, payment);
        return res.status(200).json({
            message: "Invoice sent to your email successfully",
            success: true,
        });
    }
    catch (err) {
        console.error("Error processing invoice download:", err);
        return res.status(500).json({
            message: "Server error while processing invoice",
            success: false,
        });
    }
};
exports.InvoiceDownload = InvoiceDownload;
// PDF Generation Function - UPDATED
const generateInvoicePDF = (payment) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            // Use amountDetails.totalAmount instead of payment.amount
            const totalAmount = payment.amountDetails?.totalAmount || 0;
            const baseAmount = payment.amountDetails?.baseAmount || 0;
            const discountAmount = payment.amountDetails?.discountAmount || 0;
            const taxAmount = payment.amountDetails?.taxAmount || 0;
            // Add header
            doc
                .fontSize(20)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text('INVOICE', 50, 50, { align: 'center' });
            // Company Info
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Your Company Name', 50, 90)
                .text('123 Business Street', 50, 105)
                .text('City, State 12345', 50, 120)
                .text('Email: info@company.com', 50, 135)
                .text('Phone: +1 (555) 123-4567', 50, 150);
            // Invoice Details
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text(`Invoice #: ${payment.orderId || payment._id}`, 350, 90)
                .font('Helvetica')
                .text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 350, 110)
                .text(`Status: ${payment.status}`, 350, 130);
            // Customer Info
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text('Bill To:', 50, 180)
                .font('Helvetica')
                .text(payment.user.name, 50, 200)
                .text(payment.user.email, 50, 215);
            // Line
            doc
                .moveTo(50, 250)
                .lineTo(550, 250)
                .strokeColor('#cccccc')
                .stroke();
            // Table Header
            doc
                .fontSize(12)
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text('Description', 50, 270)
                .text('Amount', 450, 270, { width: 100, align: 'right' });
            // Table Content - Detailed breakdown
            let yPosition = 300;
            // Base Amount
            doc
                .font('Helvetica')
                .fillColor('#333333')
                .text(payment.instanceId?.instanceName || 'Service Payment', 50, yPosition)
                .text(`$${baseAmount.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
            yPosition += 20;
            // Discount (if any)
            if (discountAmount > 0) {
                doc
                    .font('Helvetica')
                    .fillColor('#27ae60')
                    .text('Discount', 50, yPosition)
                    .text(`-$${discountAmount.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
                yPosition += 20;
            }
            // Tax (if any)
            if (taxAmount > 0) {
                doc
                    .font('Helvetica')
                    .fillColor('#e74c3c')
                    .text('Tax', 50, yPosition)
                    .text(`$${taxAmount.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
                yPosition += 20;
            }
            // Line
            doc
                .moveTo(50, yPosition)
                .lineTo(550, yPosition)
                .strokeColor('#cccccc')
                .stroke();
            yPosition += 20;
            // Total
            doc
                .font('Helvetica-Bold')
                .fillColor('#2c3e50')
                .text('Total:', 350, yPosition)
                .text(`$${totalAmount.toFixed(2)}`, 450, yPosition, { width: 100, align: 'right' });
            yPosition += 40;
            // Subscription Details
            if (payment.subscriptionMonths) {
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .fillColor('#666666')
                    .text(`Subscription: ${payment.subscriptionMonths} month(s)`, 50, yPosition);
                yPosition += 15;
            }
            if (payment.period?.startDate && payment.period?.endDate) {
                doc
                    .text(`Period: ${new Date(payment.period.startDate).toLocaleDateString()} - ${new Date(payment.period.endDate).toLocaleDateString()}`, 50, yPosition);
                yPosition += 15;
            }
            yPosition += 20;
            // Footer
            doc
                .fontSize(10)
                .font('Helvetica')
                .fillColor('#666666')
                .text('Thank you for your business!', 50, yPosition, { align: 'center' })
                .text('If you have any questions, please contact us at support@company.com', 50, yPosition + 15, { align: 'center' });
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
};
