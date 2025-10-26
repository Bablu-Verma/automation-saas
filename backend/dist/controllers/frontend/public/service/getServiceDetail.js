"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceDetail = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../../models/MasterWorkflow"));
const getServiceDetail = async (req, res) => {
    try {
        const requestUser = req.user;
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Service Slug is required.",
            });
        }
        const workflow = await MasterWorkflow_1.default.findOne({ slug: id, isPublished: "ACTIVE" });
        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: "Master workflow not found.",
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
exports.getServiceDetail = getServiceDetail;
