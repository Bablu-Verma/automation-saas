import { Response } from "express";
import { AuthenticatedRequest } from "../../middlewares/loginCheck";
import User from "../../models/User";
import AutomationInstance from "../../models/AutomationInstance";
import Payment from "../../models/Payment";
import ContactUs from "../../models/ContactUs";
import MasterWorkflow from "../../models/MasterWorkflow";


export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;

    // Ensure user is an admin
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    // 🧩 Fetch total counts in parallel
    const [
      totalUsers,
      totalAutomations,
      totalPayments,
      totalContacts,
      totalWorkflows,
    ] = await Promise.all([
      User.countDocuments(),
      AutomationInstance.countDocuments(),
      Payment.countDocuments(),
      ContactUs.countDocuments(),
      MasterWorkflow.countDocuments(),
    ]);

    // 🕓 Fetch latest records
    const [
      latestUsers,
      latestPayments,
      latestContacts,
      latestAutomations,
    ] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role status createdAt"),
      Payment.find()
        .populate("user", "name email")
        .populate("instanceId", "instanceName")
        .sort({ createdAt: -1 })
        .limit(5),
      ContactUs.find().sort({ createdAt: -1 }).limit(5).select("name email subject status createdAt"),
      AutomationInstance.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("instanceName user systemStatus n8nWorkflowId createdAt"),
    ]);

    // 📊 Combine response data
    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data: {
        counts: {
          users: totalUsers,
          automations: totalAutomations,
          payments: totalPayments,
          contacts: totalContacts,
         
          workflows: totalWorkflows,
        },
        latest: {
          users: latestUsers,
          payments: latestPayments,
          contacts: latestContacts,
          automations: latestAutomations,
        },
      },
    });
  } catch (err) {
    console.error("Error fetching admin dashboard:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching admin dashboard",
    });
  }
};
