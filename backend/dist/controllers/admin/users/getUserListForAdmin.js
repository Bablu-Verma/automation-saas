"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserListForAdmin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../../../models/User"));
const getUserListForAdmin = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Access control: only admin
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can view user list.",
            });
        }
        const { page = 1, limit = 10, search = "", status = "", role = "", dateFrom = "", dateTo = "" } = req.body;
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;
        // ✅ Build filter object
        const filter = {};
        // Search filter: name, email, company, or user ID
        if (search) {
            if (mongoose_1.default.Types.ObjectId.isValid(search)) {
                filter._id = new mongoose_1.default.Types.ObjectId(search);
            }
            else {
                filter.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { "profile.company": { $regex: search, $options: "i" } }
                ];
            }
        }
        // Status filter
        if (status) {
            filter.status = status;
        }
        // Role filter
        if (role) {
            filter.role = role;
        }
        // Date range filter: createdAt
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) {
                filter.createdAt.$gte = new Date(dateFrom);
            }
            if (dateTo) {
                filter.createdAt.$lte = new Date(dateTo);
            }
        }
        // ✅ Fetch users and total count with filters
        const [users, totalUsers] = await Promise.all([
            User_1.default.find(filter)
                .select("-password -otp") // exclude sensitive fields
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            User_1.default.countDocuments(filter)
        ]);
        // ✅ Calculate statistics
        const statsAggregation = await User_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    activeUsers: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                    inactiveUsers: { $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] } },
                    adminUsers: { $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] } },
                    regularUsers: { $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] } }
                }
            }
        ]);
        const statistics = statsAggregation.length > 0 ? statsAggregation[0] : {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            adminUsers: 0,
            regularUsers: 0
        };
        // ✅ Pagination info
        const totalPages = Math.ceil(totalUsers / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;
        return res.status(200).json({
            success: true,
            message: "User list fetched successfully.",
            users,
            statistics,
            pagination: {
                page: pageNum,
                totalPages,
                hasNextPage,
                hasPrevPage,
                limit: limitNum,
                totalUsers
            }
        });
    }
    catch (error) {
        console.error("Error fetching user list for admin:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching user list.",
        });
    }
};
exports.getUserListForAdmin = getUserListForAdmin;
