import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";
import axios from "axios";

export const automationDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.body;

    console.log("Fetching details for automation ID:", id, "for user ID:", userId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!id) {
      return res.status(400).json({ message: "Automation ID is required", success: false });
    }


    const instance = await AutomationInstance.findOne({ _id: id, user: userId })
      .select("-n8nCredential")
      .populate("user", "name email")
      .populate("masterWorkflow", "name category serviceImage");

    if (!instance) {
      return res.status(404).json({
        message: "Automation instance not found",
        success: false,
      });
    }

    // console.log(instance)

    const executionsResponse = await axios.get(
      `${process.env.N8N_API_URL}/api/v1/executions`,
      {
        headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY },
        params: { workflowId: instance.n8nWorkflowId, limit: 100 }
      }
    );

    const executions = executionsResponse.data.data;

    const totalExecutions = executions.length;
    const lastExecution = executions[0]?.startedAt || null;

    instance.usageCount = totalExecutions,
    instance.lastExecutedAt = lastExecution,

    await instance.save()

    return res.status(200).json({
      message: "Automation instance detail fetched successfully",
      success: true,
      automation: instance,
    });
  } catch (err) {
    console.error("Error fetching automation detail:", err);
    return res.status(500).json({
      message: "Server error while fetching automation detail.",
      success: false,
    });
  }
};
