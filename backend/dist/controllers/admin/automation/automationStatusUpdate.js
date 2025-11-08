"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAutomationStatusById = updateAutomationStatusById;
const _n8n_helper_1 = require("../../../lib/_n8n_helper");
const AutomationInstance_1 = __importDefault(require("../../../models/AutomationInstance"));
const sendAutomationStatusUpdateEmail_1 = require("../../../email/sendAutomationStatusUpdateEmail");
async function updateAutomationStatusById(req, res) {
    try {
        const requestUser = req.user;
        // ✅ Access control
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can view user automations.",
            });
        }
        const { automationId, systemStatus } = req.body;
        if (!automationId || !systemStatus) {
            return res.status(400).json({
                success: false,
                message: "automationId and systemStatus are required.",
            });
        }
        // Find automation
        const automation = await AutomationInstance_1.default.findById(automationId).populate("user", "name email");
        ;
        if (!automation) {
            return res.status(404).json({
                success: false,
                message: "Automation not found.",
            });
        }
        // Define behavior based on systemStatus
        const pauseStatuses = ["NEED_PAYMENT", "EXPIRED", "CONTACT_SUPPORT"];
        const activeStatuses = ["TRIAL", "ACTIVE"];
        let isPaused = false;
        if (pauseStatuses.includes(systemStatus)) {
            isPaused = true;
        }
        else if (activeStatuses.includes(systemStatus)) {
            isPaused = false;
        }
        else {
            return res.status(400).json({
                success: false,
                message: `Invalid systemStatus value: ${systemStatus}`,
            });
        }
        // n8n Workflow toggle
        try {
            await (0, _n8n_helper_1.toggleN8nWorkflow)(automation.n8nWorkflowId, !isPaused);
        }
        catch (n8nError) {
            console.error("Failed to toggle n8n workflow:", n8nError);
        }
        // Update automation in DB
        automation.systemStatus = systemStatus;
        automation.isActive = isPaused ? "PAUSE" : "RUNNING";
        await automation.save();
        await (0, sendAutomationStatusUpdateEmail_1.sendAutomationStatusUpdateEmail)(automation.user?.email, automation.user?.name, automation.instanceName, systemStatus);
        return res.status(200).json({
            success: true,
            message: `Automation ${isPaused ? "paused" : "activated"} successfully.`,
            data: {
                automationId: automation._id,
                systemStatus: automation.systemStatus,
                isActive: automation.isActive,
            },
        });
    }
    catch (error) {
        console.error("Error updating automation status:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating automation status.",
        });
    }
}
