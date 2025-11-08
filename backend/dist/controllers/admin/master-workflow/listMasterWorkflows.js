"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMasterWorkflows = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../models/MasterWorkflow"));
const mongoose_1 = __importDefault(require("mongoose"));
const listMasterWorkflows = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Access control: only admin or developer
        if (!requestUser || (requestUser.role !== "admin" && requestUser.role !== "developer")) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators and developers can view master workflows.",
            });
        }
        // ✅ Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // ✅ Filters from query
        const { search = "", status = "", dateFrom = "", dateTo = "" } = req.body;
        const filter = {};
        // ✅ Search by name, slug, or _id
        if (search) {
            if (mongoose_1.default.Types.ObjectId.isValid(search)) {
                filter.$or = [
                    { _id: new mongoose_1.default.Types.ObjectId(search) },
                    { name: { $regex: search, $options: "i" } },
                    { slug: { $regex: search, $options: "i" } },
                ];
            }
            else {
                filter.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { slug: { $regex: search, $options: "i" } },
                ];
            }
        }
        // ✅ Filter by status (isPublished)
        if (status) {
            filter.isPublished = status.toString().toUpperCase(); // ACTIVE or PAUSE
        }
        // ✅ Filter by creation date
        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom)
                filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo)
                filter.createdAt.$lte = new Date(dateTo);
        }
        // ✅ Fetch workflows with pagination
        const workflows = await MasterWorkflow_1.default.find(filter)
            .sort({ name: 1 })
            .select("-workflowJsonTemplate -description")
            .skip(skip)
            .limit(limit)
            .lean();
        // ✅ Total count for pagination
        const total = await MasterWorkflow_1.default.countDocuments(filter);
        // ✅ Statistics
        const stats = await MasterWorkflow_1.default.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: null,
                    totalWorkflows: { $sum: 1 },
                    activeWorkflows: { $sum: { $cond: [{ $eq: ["$isPublished", "ACTIVE"] }, 1, 0] } },
                    inactiveWorkflows: { $sum: { $cond: [{ $eq: ["$isPublished", "PAUSE"] }, 1, 0] } },
                },
            },
        ]);
        const statistics = stats.length > 0 ? stats[0] : {
            totalWorkflows: 0,
            activeWorkflows: 0,
            inactiveWorkflows: 0,
        };
        return res.status(200).json({
            success: true,
            message: "Master workflows fetched successfully.",
            workflows,
            statistics: {
                totalWorkflows: statistics.totalWorkflows,
                activeWorkflows: statistics.activeWorkflows,
                inactiveWorkflows: statistics.inactiveWorkflows,
            },
            pagination: {
                page,
                totalPages: Math.ceil(total / limit),
                total,
                count: workflows.length,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1,
                limit,
            },
        });
    }
    catch (error) {
        console.error("Error listing master workflows:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching master workflows.",
        });
    }
};
exports.listMasterWorkflows = listMasterWorkflows;
