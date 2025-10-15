import { Request, Response } from 'express';
import { toggleN8nWorkflow } from '../../../lib/_n8n_helper';
import AutomationInstance from '../../../models/AutomationInstance';

export async function AutomateupdateAutomationStatuses(req: Request, res: Response) {
  try {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    // Optimized query
    const automations = await AutomationInstance.find({
      "systemStatus": { $in: ["TRIAL", "ACTIVE", "EXPIRE_SOON"] },
      "periods.endTime": {
        $exists: true,
        $ne: null,
        $lte: twoDaysFromNow
      }
    });

    console.log(`Found ${automations.length} automations for status update`);

    if (automations.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          expired: 0,
          expiringSoon: 0,
          updatedIds: [],
        },
        message: "No automations found for status update."
      });
    }

    const expiredIds: string[] = [];
    const expiringSoonIds: string[] = [];
    const updatePromises: Promise<any>[] = [];

    for (const automation of automations) {
      const endTime = automation.periods?.endTime;
      if (!endTime) continue;

      if (endTime < now) {
        expiredIds.push(automation._id.toString());

        updatePromises.push(
          (async () => {
            try {
              // Try to deactivate in n8n first
              await toggleN8nWorkflow(automation.n8nWorkflowId, false);
            } catch (n8nError) {
              console.error(`n8n deactivation failed for ${automation._id}:`, n8nError);
              // Continue with DB update even if n8n fails
            }

            // Update database
            return AutomationInstance.findByIdAndUpdate(
              automation._id,
              {
                $set: {
                  "systemStatus": "EXPIRED",
                  "isActive": "PAUSE",
                }
              }
            );
          })()
        );
      }
      else if (endTime <= twoDaysFromNow && automation.systemStatus !== "EXPIRE_SOON") {
        expiringSoonIds.push(automation._id.toString());

        updatePromises.push(
          AutomationInstance.findByIdAndUpdate(
            automation._id,
            { $set: { "systemStatus": "EXPIRE_SOON" } }
          )
        );
      }
    }

    // Execute all updates
    await Promise.all(updatePromises);

    const updatedIds = [...expiredIds, ...expiringSoonIds];

    return res.status(200).json({
      success: true,
      data: {
        expired: expiredIds.length,
        expiringSoon: expiringSoonIds.length,
        updatedIds,
        totalUpdated: updatedIds.length
      },
      message: `Status updated successfully: ${expiredIds.length} expired, ${expiringSoonIds.length} expiring soon`
    });

  } catch (error) {
    console.error("Error updating automation statuses:", error);
    
    return res.status(500).json({
      success: false,
      data: {
        expired: 0,
        expiringSoon: 0,
        updatedIds: [],
      },
      message: "Failed to update automation statuses",
    });
  }
}
