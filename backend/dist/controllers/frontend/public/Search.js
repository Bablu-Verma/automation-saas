"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchService = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../models/MasterWorkflow"));
const searchService = async (req, res) => {
    try {
        // Body params (POST)
        const { page = 1, limit = 10, search = "", category = "" } = req.body;
        const skip = (page - 1) * limit;
        // Build filter
        let filter = { isPublished: "ACTIVE" };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        if (category) {
            filter.category = category;
        }
        // Query DB
        const workflows = await MasterWorkflow_1.default.find(filter)
            .select('-workflowJsonTemplate -description')
            .sort({ createdAt: -1 }) // latest first
            .skip(skip)
            .limit(limit);
        const total = await MasterWorkflow_1.default.countDocuments(filter);
        return res.status(200).json({
            success: true,
            message: "Search results fetched successfully.",
            count: workflows.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            workflows,
        });
    }
    catch (error) {
        console.error("Error searching workflows:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while searching workflows.",
        });
    }
};
exports.searchService = searchService;
