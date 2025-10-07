import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";
import AutomationInstance from "../../../models/AutomationInstance";
import mongoose from "mongoose";

export const getUserDetailsForAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    const { id } = req.body;

    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view user details.",
      });
    }

    // ✅ Validate user ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required.",
      });
    }

    // ✅ Fetch user details
    const user = await User.findById(id)
      .select("-password -otp") // exclude sensitive fields
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Fetch user's automations count and stats
    const automationStats = await AutomationInstance.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalAutomations: { $sum: 1 },
          activeAutomations: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
          },
          totalExecutions: { $sum: "$executionCount" },
          lastActivity: { $max: "$lastExecutedAt" }
        }
      }
    ]);

    // ✅ Fetch recent automations
    const recentAutomations = await AutomationInstance.find({ user: id })
      .populate("masterWorkflow", "name category serviceIconUrl")
      .select("instanceName executionCount lastExecutedAt createdAt status")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const stats = automationStats.length > 0 ? automationStats[0] : {
      totalAutomations: 0,
      activeAutomations: 0,
      totalExecutions: 0,
      lastActivity: null
    };

    // ✅ Enhanced user data with stats
    const userDetails = {
      ...user,
      stats: {
        totalAutomations: stats.totalAutomations,
        activeAutomations: stats.activeAutomations,
        totalExecutions: stats.totalExecutions,
        lastActivity: stats.lastActivity,
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      },
      recentAutomations
    };

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully.",
      user: userDetails,
    });

  } catch (error) {
    console.error("Error fetching user details for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user details.",
    });
  }
};

