"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPayments = void 0;
const Payment_1 = __importDefault(require("../../../../models/Payment"));
const getUserPayments = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { page = 1, limit = 10 } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const payments = await Payment_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('user', 'name email profile')
            .populate("instanceId", "instanceName status");
        const totalPayments = await Payment_1.default.countDocuments({ user: userId });
        return res.status(200).json({
            message: "Payments fetched successfully",
            success: true,
            payments,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalPayments / limitNum),
                totalPayments,
                hasNext: pageNum < Math.ceil(totalPayments / limitNum),
                hasPrev: pageNum > 1
            }
        });
    }
    catch (err) {
        console.error("Error fetching payments:", err);
        return res.status(500).json({
            message: "Server error while fetching payments",
            success: false,
        });
    }
};
exports.getUserPayments = getUserPayments;
