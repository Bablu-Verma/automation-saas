"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentDetails = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const getPaymentDetails = async (req, res) => {
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
            .populate("instanceId", "instanceName status")
            .lean();
        if (!payment) {
            return res.status(404).json({ message: "Payment not found", success: false });
        }
        return res.status(200).json({
            message: "Payment details fetched successfully",
            success: true,
            payment,
        });
    }
    catch (err) {
        console.error("Error fetching payment details:", err);
        return res.status(500).json({
            message: "Server error while fetching payment details",
            success: false,
        });
    }
};
exports.getPaymentDetails = getPaymentDetails;
