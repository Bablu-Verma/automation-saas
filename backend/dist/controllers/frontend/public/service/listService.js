"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listService = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../../models/MasterWorkflow"));
const listService = async (req, res) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        let filter = {};
        filter = { isPublished: "ACTIVE" };
        const workflows = await MasterWorkflow_1.default.find(filter)
            .sort({ name: 1 })
            .select('-workflowJsonTemplate -description')
            .skip(skip)
            .limit(limit);
        const total = await MasterWorkflow_1.default.countDocuments(filter);
        return res.status(200).json({
            success: true,
            message: "Master workflows fetched successfully.",
            count: workflows.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            workflows,
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
exports.listService = listService;
