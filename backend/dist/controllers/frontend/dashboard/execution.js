"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserExecutions = void 0;
const axios_1 = __importDefault(require("axios"));
const AutomationInstance_1 = __importDefault(require("../../../models/AutomationInstance"));
const getUserExecutions = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { page = 1, limit = 10, workflowId: filterWorkflowId } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Fetch workflows of user (with optional workflowId filter)
        let query = { user: userId };
        if (filterWorkflowId) {
            query._id = filterWorkflowId;
        }
        const instances = await AutomationInstance_1.default.find(query)
            .select("n8nWorkflowId instanceName masterWorkflow")
            .populate("masterWorkflow", "name category serviceImage");
        let allExecutions = [];
        // Fetch executions for each workflow
        for (const instance of instances) {
            if (!instance.n8nWorkflowId)
                continue;
            const workflowId = instance.n8nWorkflowId;
            try {
                const executionsResponse = await axios_1.default.get(`${process.env.N8N_API_URL}/api/v1/executions`, {
                    headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
                    params: { workflowId, limit: 100 }, // Adjust limit as needed
                });
                const executions = executionsResponse.data?.data || executionsResponse.data || [];
                const mappedExecutions = executions.map((exec) => ({
                    ...exec,
                    instanceName: instance.instanceName,
                    finished: exec.finished || null,
                    startedAt: exec.startedAt || null,
                    status: exec.status || "unknown",
                }));
                allExecutions.push(...mappedExecutions);
            }
            catch (err) {
                console.error(`Error fetching executions for workflow ${workflowId}:`, err);
            }
        }
        // Sort executions by finished date descending (latest first)
        allExecutions.sort((a, b) => new Date(b.finished).getTime() - new Date(a.finished).getTime());
        const totalExecutions = allExecutions.length;
        const paginatedExecutions = allExecutions.slice(skip, skip + limitNum);
        return res.status(200).json({
            message: "Executions fetched successfully",
            success: true,
            executions: paginatedExecutions,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalExecutions / limitNum),
                totalExecutions,
                hasNext: pageNum < Math.ceil(totalExecutions / limitNum),
                hasPrev: pageNum > 1
            }
        });
    }
    catch (err) {
        console.error("Error fetching executions:", err);
        return res.status(500).json({
            message: "Server error while fetching executions",
            success: false,
        });
    }
};
exports.getUserExecutions = getUserExecutions;
