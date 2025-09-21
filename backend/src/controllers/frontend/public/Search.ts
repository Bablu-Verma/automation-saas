import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const searchService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Body params (POST)
    const {
      page = 1,
      limit = 10,
      search = "",
      category = ""
    } = req.body;

    const skip = (page - 1) * limit;

    // Build filter
    let filter: Record<string, any> = { isPublished: "ACTIVE" };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    // Query DB
    const workflows = await MasterWorkflow.find(filter)
      .select('-workflowJsonTemplate -description')
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    const total = await MasterWorkflow.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Search results fetched successfully.",
      count: workflows.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      workflows,
    });
  } catch (error) {
    console.error("Error searching workflows:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while searching workflows.",
    });
  }
};
