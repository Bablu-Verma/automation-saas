import { Request, Response } from "express";
import { toggleN8nWorkflow } from "../../../lib/_n8n_helper";
import AutomationInstance from "../../../models/AutomationInstance";
import { sendAutomationExpirationEmail } from "../../../email/sendAutomationExpirationEmail";
import { IUser } from "../../../types/types";

export async function AutomateupdateAutomationStatuses(req: Request, res: Response) {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Fetch automations nearing or past expiration
    const automations = await AutomationInstance.find({
      systemStatus: { $in: ["TRIAL", "ACTIVE", "EXPIRE_SOON"] },
      "periods.endTime": { $exists: true, $ne: null, $lte: twoDaysFromNow },
    }).populate<{ user: IUser }>("user", "name email");

    if (!automations.length) {
      return res.status(200).json({
        success: true,
        data: { expired: 0, expiringSoon: 0, updatedIds: [] },
        message: "No automations found for status update.",
      });
    }

    const expiredIds: string[] = [];
    const expiringSoonIds: string[] = [];
    const updatePromises: Promise<any>[] = [];

    for (const automation of automations) {
      const endTime = automation.periods?.endTime;
      if (!endTime) continue;

      // Check expiration condition
      if (endTime < now) {
        expiredIds.push(automation._id.toString());

        updatePromises.push(
          (async () => {
            try {
              // Try to deactivate in n8n
              await toggleN8nWorkflow(automation.n8nWorkflowId, false);
            } catch (err) {
              console.error(`⚠️ Failed to deactivate in n8n for ${automation._id}:`, err);
            }

            // Send expiry email (safely)
            if (automation.user) {
              await sendAutomationExpirationEmail(
                automation.user.email,
                automation.user.name,
                automation.instanceName,
                "EXPIRED"
              );
            }

            // Update DB
            return AutomationInstance.findByIdAndUpdate(automation._id, {
              $set: { systemStatus: "EXPIRED", isActive: "PAUSE" },
            });
          })()
        );
      }

      // Check expiring soon condition
      else if (endTime <= twoDaysFromNow && automation.systemStatus !== "EXPIRE_SOON") {
        expiringSoonIds.push(automation._id.toString());

        updatePromises.push(
          (async () => {
            // Send email (safe check)
            if (automation.user && automation.user.email) {
              await sendAutomationExpirationEmail(
                automation.user.email,
                automation.user.name,
                automation.instanceName,
                "EXPIRE_SOON"
              );
            }

            return AutomationInstance.findByIdAndUpdate(automation._id, {
              $set: { systemStatus: "EXPIRE_SOON" },
            });
          })()
        );
      }
    }

    // Execute all updates concurrently
    await Promise.all(updatePromises);

    const updatedIds = [...expiredIds, ...expiringSoonIds];

    return res.status(200).json({
      success: true,
      data: {
        expired: expiredIds.length,
        expiringSoon: expiringSoonIds.length,
        updatedIds,
        totalUpdated: updatedIds.length,
      },
      message: `✅ Status updated: ${expiredIds.length} expired, ${expiringSoonIds.length} expiring soon.`,
    });
  } catch (error) {
    console.error("❌ Error updating automation statuses:", error);

    return res.status(500).json({
      success: false,
      data: { expired: 0, expiringSoon: 0, updatedIds: [] },
      message: "Server error while updating automation statuses.",
    });
  }
}
