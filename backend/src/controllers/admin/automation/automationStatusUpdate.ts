import { Request, Response } from "express";
import { toggleN8nWorkflow } from "../../../lib/_n8n_helper";
import AutomationInstance from "../../../models/AutomationInstance";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";

export async function updateAutomationStatusById(req: AuthenticatedRequest, res: Response) {
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
    const automation = await AutomationInstance.findById(automationId);
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
    } else if (activeStatuses.includes(systemStatus)) {
      isPaused = false;
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid systemStatus value: ${systemStatus}`,
      });
    }

    // n8n Workflow toggle
    try {
      await toggleN8nWorkflow(automation.n8nWorkflowId, !isPaused);
    } catch (n8nError) {
      console.error("Failed to toggle n8n workflow:", n8nError);
    }

    // Update automation in DB
    automation.systemStatus = systemStatus;
    automation.isActive = isPaused ? "PAUSE" : "RUNNING";
    await automation.save();

    return res.status(200).json({
      success: true,
      message: `Automation ${isPaused ? "paused" : "activated"} successfully.`,
      data: {
        automationId: automation._id,
        systemStatus: automation.systemStatus,
        isActive: automation.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating automation status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating automation status.",
    });
  }
}
