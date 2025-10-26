import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";
import mongoose from "mongoose";

export const listMasterWorkflows = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control: only admin or developer
    if (!requestUser || (requestUser.role !== "admin" && requestUser.role !== "developer")) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can view master workflows.",
      });
    }

    // ✅ Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // ✅ Filters from query
    const { search = "", status = "", dateFrom = "", dateTo = "" } = req.body;

    const filter: Record<string, any> = {};

    // ✅ Search by name, slug, or _id
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search as string)) {
        filter.$or = [
          { _id: new mongoose.Types.ObjectId(search as string) },
          { name: { $regex: search as string, $options: "i" } },
          { slug: { $regex: search as string, $options: "i" } },
        ];
      } else {
        filter.$or = [
          { name: { $regex: search as string, $options: "i" } },
          { slug: { $regex: search as string, $options: "i" } },
        ];
      }
    }

    // ✅ Filter by status (isPublished)
    if (status) {
      filter.isPublished = status.toString().toUpperCase(); // ACTIVE or PAUSE
    }

    // ✅ Filter by creation date
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
    }

    // ✅ Fetch workflows with pagination
    const workflows = await MasterWorkflow.find(filter)
      .sort({ name: 1 })
      .select("-workflowJsonTemplate -description")
      .skip(skip)
      .limit(limit)
      .lean();

    // ✅ Total count for pagination
    const total = await MasterWorkflow.countDocuments(filter);

    // ✅ Statistics
    const stats = await MasterWorkflow.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalWorkflows: { $sum: 1 },
          activeWorkflows: { $sum: { $cond: [{ $eq: ["$isPublished", "ACTIVE"] }, 1, 0] } },
          inactiveWorkflows: { $sum: { $cond: [{ $eq: ["$isPublished", "PAUSE"] }, 1, 0] } },
        },
      },
    ]);

    const statistics = stats.length > 0 ? stats[0] : {
      totalWorkflows: 0,
      activeWorkflows: 0,
      inactiveWorkflows: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Master workflows fetched successfully.",
      workflows,
      statistics: {
        totalWorkflows: statistics.totalWorkflows,
        activeWorkflows: statistics.activeWorkflows,
        inactiveWorkflows: statistics.inactiveWorkflows,
      },
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total,
        count: workflows.length,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        limit,
      },
    });

  } catch (error) {
    console.error("Error listing master workflows:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching master workflows.",
    });
  }
};
