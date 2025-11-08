"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = exports.InvoiceDownload = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const sendInvoiceEmail_1 = require("../../../../email/sendInvoiceEmail");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
        const pdfBuffer = await (0, exports.generateInvoicePDF)(payment);
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
const generateInvoicePDF = (payment) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            // ======= UTILITIES =======
            const drawLine = (y) => {
                doc.strokeColor("#E5E5E5").moveTo(50, y).lineTo(550, y).stroke();
            };
            const formatCurrency = (num) => `${num.toFixed(2)} ${payment.currency}`;
            // ======= HEADER =======
            const logoPath = path_1.default.join(process.cwd(), "public", "logo.png");
            if (fs_1.default.existsSync(logoPath)) {
                doc.image(logoPath, 50, 45, { width: 60 });
            }
            doc
                .fontSize(22)
                .fillColor("#2C3E50")
                .font("Helvetica-Bold")
                .text("INVOICE", 120, 50);
            doc
                .fontSize(10)
                .fillColor("#666")
                .font("Helvetica")
                .text("Loop Axis", 400, 50, { align: "right" })
                .text("Sector 121", 400, 65, { align: "right" })
                .text("Noida, India - 201309", 400, 80, { align: "right" })
                .text("Email: loopaxisautomation@gmail.com", 400, 95, { align: "right" });
            drawLine(120);
            // ======= BILLING DETAILS =======
            doc
                .fontSize(12)
                .fillColor("#2C3E50")
                .font("Helvetica-Bold")
                .text("Bill To:", 50, 140);
            doc
                .font("Helvetica")
                .fillColor("#333")
                .text(payment.user.name, 50, 160)
                .text(payment.user.email, 50, 175);
            doc
                .font("Helvetica-Bold")
                .fillColor("#2C3E50")
                .text("Invoice Details:", 300, 140);
            // Handle long Invoice IDs dynamically
            doc.font("Helvetica").fillColor("#333");
            const invoiceIdText = `Invoice: #${payment.orderId || payment._id}`;
            const idHeight = doc.heightOfString(invoiceIdText, { width: 200 });
            doc.text(invoiceIdText, 300, 160, { width: 200 });
            doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 300, 160 + idHeight + 5);
            doc.text(`Status: ${payment.status}`, 300, 160 + idHeight + 20);
            // ======= TABLE HEADER =======
            const tableTop = 230;
            doc
                .fontSize(12)
                .font("Helvetica-Bold")
                .fillColor("#fff")
                .rect(50, tableTop, 500, 25)
                .fill("#34495E")
                .fillColor("#fff")
                .text("Description", 60, tableTop + 7)
                .text("Qty", 350, tableTop + 7)
                .text("Amount", 450, tableTop + 7, { width: 90, align: "right" });
            // ======= TABLE BODY =======
            let y = tableTop + 40;
            const baseAmount = payment.amountDetails?.baseAmount || 0;
            const discountAmount = payment.amountDetails?.discountAmount || 0;
            const taxAmount = payment.amountDetails?.taxAmount || 0;
            const totalAmount = payment.amountDetails?.totalAmount || 0;
            const planName = payment.planDetails?.name ||
                payment.instanceId?.instanceName ||
                "Subscription Service";
            doc
                .fontSize(11)
                .font("Helvetica")
                .fillColor("#333")
                .text(planName, 60, y)
                .text("1", 370, y)
                .text(formatCurrency(baseAmount), 450, y, { width: 90, align: "right" });
            y += 25;
            if (discountAmount > 0) {
                doc
                    .fillColor("#27ae60")
                    .text("Discount", 60, y)
                    .text("-", 370, y)
                    .text(`-${formatCurrency(discountAmount)}`, 450, y, {
                    width: 90,
                    align: "right",
                });
                y += 25;
            }
            if (taxAmount > 0) {
                doc
                    .fillColor("#e74c3c")
                    .text("Tax", 60, y)
                    .text("-", 370, y)
                    .text(formatCurrency(taxAmount), 450, y, {
                    width: 90,
                    align: "right",
                });
                y += 25;
            }
            drawLine(y);
            // ======= TOTAL =======
            y += 20;
            doc
                .font("Helvetica-Bold")
                .fontSize(12)
                .fillColor("#2C3E50")
                .text("Total", 350, y)
                .text(formatCurrency(totalAmount), 450, y, {
                width: 90,
                align: "right",
            });
            // ======= EXTRA DETAILS =======
            y += 40;
            if (payment.paymentMethod) {
                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor("#555")
                    .text(`Payment Method: ${payment.paymentMethod.toUpperCase()}`, 50, y);
                y += 15;
            }
            if (payment.subscriptionMonths) {
                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor("#555")
                    .text(`Subscription Duration: ${payment.subscriptionMonths} month(s)`, 50, y);
                y += 15;
            }
            if (payment.period?.startDate && payment.period?.endDate) {
                doc.text(`Period: ${new Date(payment.period.startDate).toLocaleDateString()} - ${new Date(payment.period.endDate).toLocaleDateString()}`, 50, y);
                y += 15;
            }
            if (payment.planDetails?.discountPercentage) {
                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor("#555")
                    .text(`Discount Applied: ${payment.planDetails.discountPercentage}%`, 50, y);
                y += 15;
            }
            // ======= FOOTER =======
            y += 30;
            drawLine(y);
            y += 20;
            doc
                .fontSize(10)
                .fillColor("#666")
                .font("Helvetica")
                .text("Thank you for your business!", 50, y, { align: "center" })
                .text("If you have any questions, reach out at loopaxisautomation@gmail.com", 50, y + 15, { align: "center" });
            doc.end();
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.generateInvoicePDF = generateInvoicePDF;
