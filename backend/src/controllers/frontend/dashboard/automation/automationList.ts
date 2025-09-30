import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";

export const automationList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    // 🔹 Pagination params (default: page 1, limit 10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // 🔹 Total count (for frontend pagination UI)
    const total = await AutomationInstance.countDocuments({ user: userId });

    // 🔹 Get paginated data
    const automations = await AutomationInstance.find({ user: userId })
      .select("-userInputs -n8nCredential")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "User automation list fetched successfully",
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      automations,
    });
  } catch (err) {
    console.error("Error fetching automation list:", err);
    return res.status(500).json({
      message: "Server error while fetching automation list.",
      success: false,
    });
  }
};
