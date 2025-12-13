import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";

export const PaymentDetailsRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.body; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!id) {
      return res.status(400).json({ message: "Automation ID is required", success: false });
    }

    
    const instance = await AutomationInstance.findOne({ _id: id, user: userId })
      .select("-n8nCredential") 
      .populate("user", "name email") 
      .populate("masterWorkflow", "name serviceImage pricingPlans"); 

    if (!instance) {
      return res.status(404).json({
        message: "Automation instance not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Payment Details Request fetched successfully",
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
