"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterWorkflowDetail = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../models/MasterWorkflow"));
const getMasterWorkflowDetail = async (req, res) => {
    try {
        const requestUser = req.user;
        if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators and developers can edit master workflows.",
            });
        }
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Workflow ID is required.",
            });
        }
        // 🔍 Fetch workflow
        const workflow = await MasterWorkflow_1.default.findById(id);
        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: "Master workflow not found.",
            });
        }
        if (requestUser?.role !== "admin" &&
            requestUser?.role !== "developer") {
            return res.status(403).json({
                success: false,
                message: "Access denied. This workflow is not published.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Master workflow fetched successfully.",
            workflow,
        });
    }
    catch (error) {
        console.error("Error fetching workflow detail:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching workflow detail.",
        });
    }
};
exports.getMasterWorkflowDetail = getMasterWorkflowDetail;
