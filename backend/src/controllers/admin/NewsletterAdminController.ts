import { Request, Response } from "express";
import Newsletter from "../../models/Newsletter";
import { AuthenticatedRequest } from "../../middlewares/loginCheck";

export const getAllSubscribers = async (req: AuthenticatedRequest, res: Response) => {

    const requestUser = req.user;
   if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view user details.",
      });
    }
  try {
    const { page = 1, limit = 10, status, search = "" } = req.body;
    const skip = (page - 1) * limit;

    let filter: Record<string, any> = {};
    if (status) filter.status = status;
    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    const subscribers = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Subscribers fetched successfully.",
      count: subscribers.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      subscribers,
    });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching subscribers.",
    });
  }
};

// Delete subscriber controller
export const deleteSubscriber = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can delete subscribers.",
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Subscriber ID is required.",
      });
    }

    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting subscriber.",
    });
  }
};

