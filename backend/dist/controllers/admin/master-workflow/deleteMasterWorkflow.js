"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMasterWorkflow = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../models/MasterWorkflow"));
const deleteMasterWorkflow = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Access control
        if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators and developers can delete master workflows.",
            });
        }
        const { id } = req.params; // ✅ REST standard: /api/master-workflows/:id
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Workflow ID is required.",
            });
        }
        const deletedWorkflow = await MasterWorkflow_1.default.findByIdAndDelete(id);
        if (!deletedWorkflow) {
            return res.status(404).json({
                success: false,
                message: "Master workflow not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Master workflow deleted successfully.",
            deletedWorkflow, // optional: return deleted doc
        });
    }
    catch (error) {
        console.error("Error deleting master workflow:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting master workflow.",
        });
    }
};
exports.deleteMasterWorkflow = deleteMasterWorkflow;
