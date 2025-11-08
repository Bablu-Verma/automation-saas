"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationDetail = void 0;
const AutomationInstance_1 = __importDefault(require("../../../../models/AutomationInstance"));
const axios_1 = __importDefault(require("axios"));
const automationDetail = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        if (!id) {
            return res.status(400).json({ message: "Automation ID is required", success: false });
        }
        const instance = await AutomationInstance_1.default.findOne({ _id: id, user: userId })
            .select("-n8nCredential")
            .populate("user", "name email")
            .populate("masterWorkflow", "name category serviceImage");
        if (!instance) {
            return res.status(404).json({
                message: "Automation instance not found",
                success: false,
            });
        }
        console.log(instance);
        const executionsResponse = await axios_1.default.get(`${process.env.N8N_API_URL}/api/v1/executions`, {
            headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
            params: { workflowId: instance.n8nWorkflowId, limit: 100 }
        });
        const executions = executionsResponse.data.data;
        const totalExecutions = executions.length;
        const lastExecution = executions[0]?.startedAt || null;
        instance.executionCount = totalExecutions,
            instance.lastExecutedAt = lastExecution,
            await instance.save();
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
exports.automationDetail = automationDetail;
