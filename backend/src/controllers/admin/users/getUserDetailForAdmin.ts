import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";
import AutomationInstance from "../../../models/AutomationInstance";

export const getUserDetailForAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view user details.",
      });
    }

    const { id } = req.params; // user ID

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // ✅ Fetch user basic info
    const user = await User.findById(id).select("-password -otp"); // hide sensitive info
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Fetch user's automation instances (subscriptions)
    const automations = await AutomationInstance.find({ user: id })
      .populate("masterWorkflow", "name category serviceIconUrl") // fetch workflow info
      .select("instanceName subscription executionCount lastExecutedAt");

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      user,
      automations,
    });
  } catch (error) {
    console.error("Error fetching user detail for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user detail.",
    });
  }
};
