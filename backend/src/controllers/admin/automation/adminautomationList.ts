import { Response } from "express";

import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import AutomationInstance from "../../../models/AutomationInstance";



// ✅ Get automations by user for admin
export const adminUserAutomations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    
    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view user automations.",
      });
    }

   

    // ✅ Pagination parameters
    const page = parseInt(req.body.page as string) || 1;
    const limit = parseInt(req.body.limit as string) || 10;
    const skip = (page - 1) * limit;

   
   
    // ✅ Get automations
    const [automations, total] = await Promise.all([
      AutomationInstance.find()
        .select("-userInputs -n8nCredential")
        .populate("masterWorkflow", "name category serviceIconUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      AutomationInstance.countDocuments()
    ]);

  
    return res.status(200).json({
      success: true,
      message: "User automations fetched successfully.",
      automations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        limit
      }
    });

  } catch (error) {
    console.error("Error fetching user automations for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user automations.",
    });
  }
};