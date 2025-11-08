"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserAutomations = void 0;
const AutomationInstance_1 = __importDefault(require("../../../models/AutomationInstance"));
const User_1 = __importDefault(require("../../../models/User")); // ✅ Import User Model
const mongoose_1 = __importDefault(require("mongoose")); // ✅ Import Mongoose for ObjectId check
const adminUserAutomations = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Access control
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can view user automations.",
            });
        }
        // ✅ Pagination
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * limit;
        // ✅ Filters
        const { search = "", user = "", systemStatus = "", isActive = "", dateFrom = "", dateTo = "" } = req.body;
        const filter = {};
        // 🔍 Search by instance name
        if (search) {
            filter.instanceName = { $regex: search, $options: "i" };
        }
        // 🎯 Filter by user (ID, email, or name)
        if (user) {
            // 1. Check if the input 'user' is a valid MongoDB ObjectId (User ID)
            const isObjectId = mongoose_1.default.Types.ObjectId.isValid(user);
            let userFilter = {};
            if (isObjectId) {
                userFilter._id = user; // Filter by ID directly
            }
            else {
                userFilter.$or = [
                    { name: { $regex: user, $options: "i" } },
                    { email: { $regex: user, $options: "i" } },
                ];
            }
            const matchingUsers = await User_1.default.find(userFilter).select("_id").lean();
            const userIds = matchingUsers.map((u) => u._id);
            if (userIds.length > 0) {
                filter.user = { $in: userIds };
            }
            else if (!isObjectId) {
                filter.user = { $exists: false };
            }
        }
        if (systemStatus) {
            filter.systemStatus = systemStatus;
        }
        if (isActive) {
            filter.isActive = isActive;
        }
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom)
                filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo)
                filter.createdAt.$lte = new Date(dateTo);
        }
        // ✅ Query DB
        const [automations, total, stats] = await Promise.all([
            AutomationInstance_1.default.find(filter)
                .select("-userInputs -n8nCredential")
                .populate({
                path: "user",
                select: "name email",
            })
                .populate("masterWorkflow", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AutomationInstance_1.default.countDocuments(filter),
            // Stats by systemStatus
            AutomationInstance_1.default.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: "$systemStatus",
                        count: { $sum: 1 },
                        totalExecutions: { $sum: "$executionCount" },
                    },
                },
            ]),
        ]);
        // Remove automations where populate user didn't match
        const filteredAutomations = automations.filter(a => a.user);
        // Format stats
        const formattedStats = {
            totalAutomations: total,
            active: stats.find(s => s._id === "ACTIVE")?.count || 0,
            trial: stats.find(s => s._id === "TRIAL")?.count || 0,
            expired: stats.find(s => s._id === "EXPIRED")?.count || 0,
            needPayment: stats.find(s => s._id === "NEED_PAYMENT")?.count || 0,
            totalExecutions: stats.reduce((sum, s) => sum + (s.totalExecutions || 0), 0),
        };
        return res.status(200).json({
            success: true,
            message: "User automations fetched successfully.",
            automations: filteredAutomations,
            page,
            total: total,
            totalPages: Math.ceil(total / limit),
            stats: formattedStats,
        });
    }
    catch (error) {
        console.error("Error fetching user automations for admin:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching user automations.",
        });
    }
};
exports.adminUserAutomations = adminUserAutomations;
