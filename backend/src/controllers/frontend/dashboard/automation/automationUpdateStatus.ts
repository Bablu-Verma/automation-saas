import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";
import axios from "axios";




async function toggleN8nWorkflow(workflowId?: string, activate: boolean = false) {
  if (!workflowId) return;

  // Choose the correct endpoint based on the desired action
  const endpoint = activate ? 'activate' : 'deactivate';

  try {
    await axios.post( // Use POST method for activation/deactivation
      `${process.env.N8N_API_URL}/api/v1/workflows/${workflowId}/${endpoint}`,
      {},
      { headers: { "X-N8N-API-KEY": process.env.N8N_API_KEY } }
    );
    console.log(`Workflow ${workflowId} ${activate ? "ACTIVATED" : "DEACTIVATED"}`);
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
  NEED_PAYMENT = "NEED_PAYMENT",
  EXPIRE_SOON='EXPIRE_SOON'
}

export const updateAutomationStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // const userId = req.user?.id;
    const { id, isActive } = req.body;

    if (!id || !["RUNNING", "PAUSE"].includes(isActive)) {
      return res.status(400).json({ message: "Invalid request data", success: false });
    }

    // 🔹 Find automation instance
    const automation = await AutomationInstance.findById(id)
    if (!automation) {
      return res.status(404).json({ message: "Automation instance not found", success: false });
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
    if (automation.systemStatus === SystemStatus.NEED_PAYMENT) {
      return res.status(400).json({
        message: `You are already used Trail need to subscribe`,
        success: false,
      });
    }

    if (automation.systemStatus == SystemStatus.ACTIVE || automation.systemStatus == SystemStatus.TRIAL || automation.systemStatus == SystemStatus.EXPIRE_SOON) {
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




