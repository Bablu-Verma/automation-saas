"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminautomationDetail = void 0;
const AutomationInstance_1 = __importDefault(require("../../../models/AutomationInstance"));
const AdminautomationDetail = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        if (!id) {
            return res.status(400).json({ message: "Automation ID is required", success: false });
        }
        const instance = await AutomationInstance_1.default.findOne({ _id: id })
            .select("-n8nCredential")
            .populate("user", "name email")
            .populate("masterWorkflow", "name category serviceImage");
        if (!instance) {
            return res.status(404).json({
                message: "Automation instance not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Automation instance detail fetched successfully",
            success: true,
            automation: instance,
        });
    }
    catch (err) {
        console.error("Error fetching automation detail:", err);
        return res.status(500).json({
            message: "Server error while fetching automation detail.",
            success: false,
        });
    }
};
exports.AdminautomationDetail = AdminautomationDetail;
