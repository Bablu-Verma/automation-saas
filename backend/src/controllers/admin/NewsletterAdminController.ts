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
    const {
      page = 1,
      limit = 10,
      status,
      search = "",
      fromDate,
      toDate,
    } = req.body;

    const skip = (page - 1) * limit;

    // Build filter
    let filter: Record<string, any> = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Search filter - multiple fields
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        // Add one day to include the entire toDate
        const endDate = new Date(toDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.createdAt.$lte = endDate;
      }
    }



    // Query database
    const subscribers = await Newsletter.find(filter)
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments(filter);

    // Get statistics if needed
    const statistics = {
      totalSubscribers: await Newsletter.countDocuments(),
      activeSubscribers: await Newsletter.countDocuments({ status: "active" }),
      inactiveSubscribers: await Newsletter.countDocuments({ status: "inactive" }),
    };

    return res.status(200).json({
      success: true,
      message: "Subscribers fetched successfully.",
      count: subscribers.length,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
      statistics,
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

