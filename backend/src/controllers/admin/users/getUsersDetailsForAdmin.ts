import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";
import AutomationInstance from "../../../models/AutomationInstance";
import Payment from "../../../models/Payment";
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
      .select("-password -otp")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Fetch automation stats
    const automationStats = await AutomationInstance.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalAutomations: { $sum: 1 },
          activeAutomations: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
          totalExecutions: { $sum: "$usageCount" },
          lastActivity: { $max: "$lastExecutedAt" }
        }
      }
    ]);

    const recentAutomations = await AutomationInstance.find({ user: id })
      .populate("masterWorkflow", "name serviceIconUrl")
      .select("instanceName usageCount lastExecutedAt createdAt isActive")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const automation = automationStats.length > 0 ? automationStats[0] : {
      totalAutomations: 0,
      activeAutomations: 0,
      totalExecutions: 0,
      lastActivity: null
    };

    // ✅ Fetch user payments
    const payments = await Payment.find({ user: id })
      .sort({ createdAt: -1 })
      .select("orderId paymentId amountDetails currency status createdAt planDetails instanceId subscriptionMonths")
      .populate("instanceId", "instanceName status")
      .lean();

    // Optional: payment statistics
    const paymentStats = payments.reduce((acc, p) => {
      acc.totalAmount += p.amountDetails?.totalAmount || 0;
      if (p.status === "success") acc.successfulPayments += 1;
      else if (p.status === "failed") acc.failedPayments += 1;
      else if (p.status === "pending") acc.pendingPayments += 1;
      return acc;
    }, { totalAmount: 0, successfulPayments: 0, failedPayments: 0, pendingPayments: 0 });

    // ✅ Compile user details
    const userDetails = {
      ...user,
      stats: {
        totalAutomations: automation.totalAutomations,
        activeAutomations: automation.activeAutomations,
        totalExecutions: automation.totalExecutions,
        lastActivity: automation.lastActivity,
        accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        totalPayments: payments.length,
        totalAmount: paymentStats.totalAmount,
        successfulPayments: paymentStats.successfulPayments,
        failedPayments: paymentStats.failedPayments,
        pendingPayments: paymentStats.pendingPayments
      },
      recentAutomations,
      payments
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
