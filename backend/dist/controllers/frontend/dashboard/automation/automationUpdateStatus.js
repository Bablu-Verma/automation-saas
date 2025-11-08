"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAutomationStatus = void 0;
const AutomationInstance_1 = __importDefault(require("../../../../models/AutomationInstance"));
const _n8n_helper_1 = require("../../../../lib/_n8n_helper");
var SystemStatus;
(function (SystemStatus) {
    SystemStatus["TRIAL"] = "TRIAL";
    SystemStatus["ACTIVE"] = "ACTIVE";
    SystemStatus["EXPIRED"] = "EXPIRED";
    SystemStatus["CONTACT_SUPPORT"] = "CONTACT_SUPPORT";
    SystemStatus["NEED_PAYMENT"] = "NEED_PAYMENT";
    SystemStatus["EXPIRE_SOON"] = "EXPIRE_SOON";
})(SystemStatus || (SystemStatus = {}));
const updateAutomationStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id, isActive } = req.body;
        if (!id || !["RUNNING", "PAUSE"].includes(isActive)) {
            return res.status(400).json({ message: "Invalid request data", success: false });
        }
        // 🔹 Find automation instance
        const automation = await AutomationInstance_1.default.findOne({ _id: id, user: userId });
        if (!automation) {
            return res.status(404).json({ message: "Automation instance not found", success: false });
        }
        if (isActive === "PAUSE") {
            const success = await (0, _n8n_helper_1.toggleN8nWorkflow)(automation.n8nWorkflowId, false);
            if (success) {
                automation.isActive = "PAUSE";
                await automation.save();
                return res.status(200).json({
                    message: "Automation paused successfully",
                    success: true,
                    automation,
                });
            }
            else {
                return res.status(500).json({
                    message: "Failed to pause automation in the backend. Please try again.",
                    success: false,
                });
            }
        }
        if (automation.systemStatus === SystemStatus.CONTACT_SUPPORT) {
            return res.status(400).json({
                message: `Cannot RUNNING Please contact our support some problem created `,
                success: false,
            });
        }
        if (automation.systemStatus === SystemStatus.EXPIRED) {
            return res.status(400).json({
                message: `Your subscription is over, Please Re-new your subscription`,
                success: false,
            });
        }
        if (automation.systemStatus === SystemStatus.NEED_PAYMENT) {
            return res.status(400).json({
                message: `You are already used Trail need to subscribe`,
                success: false,
            });
        }
        if (automation.systemStatus == SystemStatus.ACTIVE || automation.systemStatus == SystemStatus.TRIAL || automation.systemStatus == SystemStatus.EXPIRE_SOON) {
            const success = await (0, _n8n_helper_1.toggleN8nWorkflow)(automation.n8nWorkflowId, true);
            if (success) {
                automation.isActive = "RUNNING";
                await automation.save();
                return res.status(200).json({
                    message: "Automation is now RUNNING successfully",
                    success: true,
                    automation,
                });
            }
            else {
                return res.status(500).json({
                    message: "Failed to activate automation in the backend. Please try again or contact support.",
                    success: false,
                });
            }
        }
    }
    catch (err) {
        console.error("Error updating automation status:", err);
        return res.status(500).json({
            message: "Server error while updating automation status.",
            success: false,
        });
    }
};
exports.updateAutomationStatus = updateAutomationStatus;
