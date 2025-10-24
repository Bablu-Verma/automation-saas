"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentslistforAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Payment_1 = __importDefault(require("../../../models/Payment"));
const getPaymentslistforAdmin = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Access control: only admin
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can view payments.",
            });
        }
        // ✅ Pagination and filter parameters
        const { page = 1, limit = 10, search = "", status = "", dateFrom = "", dateTo = "", amountMin = "", amountMax = "", } = req.body;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // ✅ Build filter object
        const filter = {};
        // ✅ Search filter (user name, email, payment ID)
        if (search) {
            const userSearchFilter = await mongoose_1.default.model('User').find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select('_id');
            const userIds = userSearchFilter.map(user => user._id);
            filter.$or = [
                { orderId: { $regex: search, $options: "i" } },
                { user: { $in: userIds } }
            ];
        }
        // ✅ Status filter
        if (status) {
            filter.status = status;
        }
        // ✅ Date range filter
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) {
                filter.createdAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.createdAt.$lte = new Date(dateTo);
            }
        }
        // ✅ Amount range filter
        if (amountMin || amountMax) {
            filter.amount = {};
            if (amountMin) {
                filter.amount.$gte = parseFloat(amountMin);
            }
            if (amountMax) {
                filter.amount.$lte = parseFloat(amountMax);
            }
        }
        // ✅ Fetch payments with filters
        const payments = await Payment_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate('user', 'name email profile')
            .populate("instanceId", "instanceName status")
            .lean();
        // ✅ Total count with same filters
        const totalPayments = await Payment_1.default.countDocuments(filter);
        // ✅ Calculate statistics
        const stats = await Payment_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    successfulPayments: {
                        $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] }
                    },
                    failedPayments: {
                        $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] }
                    },
                    pendingPayments: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    averageAmount: { $avg: "$amount" }
                }
            }
        ]);
        const statistics = stats.length > 0 ? stats[0] : {
            totalAmount: 0,
            successfulPayments: 0,
            failedPayments: 0,
            pendingPayments: 0,
            averageAmount: 0
        };
        return res.status(200).json({
            message: "Payments fetched successfully",
            success: true,
            payments,
            statistics: {
                totalAmount: statistics.totalAmount,
                successfulPayments: statistics.successfulPayments,
                failedPayments: statistics.failedPayments,
                pendingPayments: statistics.pendingPayments,
                averageAmount: Math.round(statistics.averageAmount * 100) / 100
            },
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalPayments / limitNum),
                totalPayments,
                hasNext: pageNum < Math.ceil(totalPayments / limitNum),
                hasPrev: pageNum > 1,
                limit: limitNum
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
exports.getPaymentslistforAdmin = getPaymentslistforAdmin;
