import { Request, Response } from "express";
import { toggleN8nWorkflow } from "../../../lib/_n8n_helper";
import AutomationInstance from "../../../models/AutomationInstance";
import { sendAutomationExpirationEmail } from "../../../email/sendAutomationExpirationEmail";
import { IUser } from "../../../types/types";

export async function AutomateupdateAutomationStatuses(
  req: Request,
  res: Response
) {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

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
    const updatePromises: Promise<void>[] = [];

    for (const automation of automations) {
      const endTime = automation.periods?.endTime;
      if (!endTime) continue;

      /* -------------------- EXPIRED -------------------- */
      if (endTime < now && automation.systemStatus !== "EXPIRED") {
        expiredIds.push(automation._id.toString());

        updatePromises.push(
          (async () => {
            // Stop workflow (best effort)
            try {
              await toggleN8nWorkflow(automation.n8nWorkflowId, false);
            } catch (err) {
              console.error(
                `⚠️ n8n stop failed for ${automation._id}:`,
                err
              );
            }

            // Update DB FIRST (important)
            await AutomationInstance.findByIdAndUpdate(automation._id, {
              $set: {
                systemStatus: "EXPIRED",
                isActive: "PAUSE",
              },
            });

            // Send email safely
            if (automation.user?.email) {
              try {
                await sendAutomationExpirationEmail(
                  automation.user.email,
                  automation.user.name,
                  automation.instanceName,
                  "EXPIRED"
                );
              } catch (mailErr) {
                console.error(
                  `⚠️ Expired email failed for ${automation._id}:`,
                  mailErr
                );
              }
            }
          })()
        );
      }

      /* ---------------- EXPIRE SOON ---------------- */
      else if (
        endTime <= twoDaysFromNow &&
        automation.systemStatus !== "EXPIRE_SOON"
      ) {
        expiringSoonIds.push(automation._id.toString());

        updatePromises.push(
          (async () => {
            await AutomationInstance.findByIdAndUpdate(automation._id, {
              $set: { systemStatus: "EXPIRE_SOON" },
            });

            if (automation.user?.email) {
              try {
                await sendAutomationExpirationEmail(
                  automation.user.email,
                  automation.user.name,
                  automation.instanceName,
                  "EXPIRE_SOON"
                );
              } catch (mailErr) {
                console.error(
                  `⚠️ Expire-soon email failed for ${automation._id}:`,
                  mailErr
                );
              }
            }
          })()
        );
      }
    }

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
