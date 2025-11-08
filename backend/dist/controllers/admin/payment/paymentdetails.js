"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentDetailsForAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../../../models/Payment"));
const getPaymentDetailsForAdmin = async (req, res) => {
    try {
        const requestUser = req.user;
        const { id } = req.body;
        // ✅ Access control: only admin
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can view payment details.",
            });
        }
        // ✅ Validate payment ID
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid payment ID is required.",
            });
        }
        // ✅ Fetch payment details
        const payment = await Payment_1.default.findById(id)
            .populate('user', 'name email profile phoneNumber')
            .populate("instanceId", "instanceName systemStatus masterWorkflow")
            .populate({
            path: "instanceId",
            populate: {
                path: "masterWorkflow",
                select: "name"
            }
        })
            .lean();
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Payment details fetched successfully.",
            payment
        });
    }
    catch (error) {
        console.error("Error fetching payment details:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching payment details.",
        });
    }
};
exports.getPaymentDetailsForAdmin = getPaymentDetailsForAdmin;
