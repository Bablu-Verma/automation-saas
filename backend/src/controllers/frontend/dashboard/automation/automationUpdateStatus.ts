import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";
import User from "../../../../models/User";
import axios from "axios";
import { UserDocument } from "../../../../types/types";

const N8N_BASE_URL = process.env.N8N_API_URL || "https://automation.babluverma.site";
const N8N_API_KEY = process.env.N8N_API_KEY || "";


async function toggleN8nWorkflow(workflowId?: string, active: boolean = false) {
  if (!workflowId) return;

  try {
    await axios.patch(
      `${N8N_BASE_URL}/rest/workflows/${workflowId}`,
      { active },
      { headers: { "X-N8N-API-KEY": N8N_API_KEY } }
    );
    console.log(`Workflow ${workflowId} updated to ${active ? "ACTIVE" : "PAUSED"}`);
  } catch (err: any) {
    console.error(
      `Failed to update n8n workflow ${workflowId}:`,
      err.response?.data || err.message
    );
  }
}

enum SystemStatus {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CONTACT_SUPPORT = "CONTACT_SUPPORT",
  PAID_PENDING = "PAID_PENDING",
}

export const updateAutomationStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id, isActive } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!id || !["RUNNING", "PAUSE"].includes(isActive)) {
      return res.status(400).json({ message: "Invalid request data", success: false });
    }

    // 🔹 Find automation instance
    const automation = await AutomationInstance.findById(id).populate("masterWorkflow");
    if (!automation) {
      return res.status(404).json({ message: "Automation instance not found", success: false });
    }

    // 🔹 Find user
    const user = (await User.findById(userId).populate(
      "trialUsedServices.masterWorkflow"
    )) as UserDocument | null;

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (isActive === "PAUSE") {
      automation.isActive = "PAUSE";

      // ✅ n8n workflow bhi pause
      if (automation.n8nWorkflowId) {
        await toggleN8nWorkflow(automation.n8nWorkflowId, false);
      }

      await automation.save();

      return res.status(200).json({
        message: "Automation paused successfully",
        success: true,
        automation,
      });
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
    if (automation.systemStatus === SystemStatus.PAID_PENDING) {
      return res.status(400).json({
        message: `You are already used Trail need to subscribe`,
        success: false,
      });
    }

    if (automation.systemStatus == SystemStatus.ACTIVE || automation.systemStatus == SystemStatus.TRIAL) {
      automation.isActive = "RUNNING";
      await automation.save();

      await toggleN8nWorkflow(automation.n8nWorkflowId, true);

      return res.status(200).json({
        message: "Automation RUNNING successfully",
        success: true,
        automation,
      });
    }


  } catch (err) {
    console.error("Error updating automation status:", err);
    return res.status(500).json({
      message: "Server error while updating automation status.",
      success: false,
    });
  }
};




