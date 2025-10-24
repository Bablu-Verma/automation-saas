"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentForAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../../../models/Payment"));
const AutomationInstance_1 = __importDefault(require("../../../models/AutomationInstance"));
const _n8n_helper_1 = require("../../../lib/_n8n_helper");
const sendPaymentStatusEmail_1 = require("../../../email/sendPaymentStatusEmail");
// ✅ Update payment controller (POST)
const updatePaymentForAdmin = async (req, res) => {
    try {
        const requestUser = req.user;
        const { id, status, note, paymentMethod } = req.body;
        // Access control: only admin
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can update payments.",
            });
        }
        // Validate payment ID
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid payment ID is required.",
            });
        }
        // Validate status
        const validStatuses = ["pending", "success", "failed", "refunded", "cancelled"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${validStatuses.join(", ")}`,
            });
        }
        // Validate paymentMethod
        const validMethods = ["card", "upi", "netbanking", "wallet", "manual", "internal"];
        if (paymentMethod && !validMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: `Invalid payment method. Allowed values: ${validMethods.join(", ")}`,
            });
        }
        if (status === "pending") {
            return res.status(400).json({
                success: false,
                message: "Please change status to a valid value.",
            });
        }
        // Fetch payment
        const payment = await Payment_1.default.findById(id);
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found." });
        }
        if (!payment.period) {
            payment.period = { startDate: undefined, endDate: undefined };
        }
        // Fetch automation instance
        const automation = await AutomationInstance_1.default.findById(payment.instanceId).populate('user', 'name email');
        if (!automation) {
            return res.status(404).json({ success: false, message: "Automation instance not found." });
        }
        // Define behavior based on payment status
        const pauseStatuses = ["failed", "refunded", "cancelled"];
        const activeStatuses = ["success"];
        let isPaused = false;
        let newSystemStatus = automation.systemStatus;
        // ❌ If payment failed / refunded / cancelled → close automation
        if (pauseStatuses.includes(status)) {
            isPaused = true;
            newSystemStatus = "EXPIRED";
            // Stop automation immediately
            automation.isActive = "PAUSE";
            automation.systemStatus = "EXPIRED";
            // End the subscription immediately
            const now = new Date();
            payment.period.endDate = now;
            // If automation.periods exists, mark it ended too
            if (!automation.periods) {
                automation.periods = { startTime: null, endTime: now };
            }
            else {
                automation.periods.endTime = now;
            }
            payment.note = "Subscription ended due to refund/cancel.";
        }
        else if (activeStatuses.includes(status)) {
            // ✅ If payment successful → activate automation and update subscription
            isPaused = false;
            newSystemStatus = "ACTIVE";
            const now = new Date();
            let startDate;
            if (payment.period.startDate && new Date(payment.period.startDate) > now) {
                // Start date is in the future — keep it
                startDate = new Date(payment.period.startDate);
            }
            else {
                // Start date is past or null — start from now
                startDate = now;
            }
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + payment.subscriptionMonths);
            payment.period.startDate = startDate;
            payment.period.endDate = endDate;
            if (!automation.periods) {
                automation.periods = { startTime: startDate, endTime: endDate };
            }
            else {
                automation.periods.startTime = startDate;
                automation.periods.endTime = endDate;
            }
            // automation.isActive = "RUNNING";
            automation.systemStatus = "ACTIVE";
        }
        // Toggle n8n workflow according to pause/resume
        try {
            await (0, _n8n_helper_1.toggleN8nWorkflow)(automation.n8nWorkflowId, !isPaused);
        }
        catch (n8nError) {
            console.error("Failed to toggle n8n workflow:", n8nError);
        }
        await automation.save();
        // Update payment details
        if (status)
            payment.status = status;
        if (paymentMethod)
            payment.paymentMethod = paymentMethod;
        if (note)
            payment.note = note;
        payment.Log.push({
            status: status || payment.status,
            note: note || `Changed status to ${status}`,
            changedAt: new Date(),
        });
        await payment.save();
        await (0, sendPaymentStatusEmail_1.sendPaymentStatusEmail)(automation.user.email, automation.user.name, payment);
        return res.status(200).json({
            success: true,
            message: "Payment updated successfully.",
            payment,
        });
    }
    catch (error) {
        console.error("Error updating payment:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating payment.",
        });
    }
};
exports.updatePaymentForAdmin = updatePaymentForAdmin;
