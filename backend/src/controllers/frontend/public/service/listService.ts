import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";


export const listMasterWorkflows = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // Pagination params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let filter: Record<string, any> = {};

    filter = { isPublished: "ACTIVE" };

    const workflows = await MasterWorkflow.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await MasterWorkflow.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Master workflows fetched successfully.",
      count: workflows.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      workflows,
    });
  } catch (error) {
    console.error("Error listing master workflows:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching master workflows.",
    });
  }
};
