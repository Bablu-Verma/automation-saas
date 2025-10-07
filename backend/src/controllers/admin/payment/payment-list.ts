
import { Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import Payment from "../../../models/Payment";

export const getPaymentslistforAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    
    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view payments.",
      });
    }

    // ✅ Pagination and filter parameters
    const { 
      page = 1, 
      limit = 10,
      search = "",
      status = "",
      paymentMethod = "",
      dateFrom = "",
      dateTo = "",
      amountMin = "",
      amountMax = "",
      userId = ""
    } = req.body;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // ✅ Build filter object
    const filter: any = {};

    // ✅ Search filter (user name, email, payment ID)
    if (search) {
      const userSearchFilter = await mongoose.model('User').find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      }).select('_id');

      const userIds = userSearchFilter.map(user => user._id);

      filter.$or = [
        { paymentId: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
        { user: { $in: userIds } }
      ];
    }

    // ✅ Status filter
    if (status) {
      filter.status = status;
    }

    // ✅ Payment method filter
    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    // ✅ Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // ✅ Amount range filter
    if (amountMin || amountMax) {
      filter.amount = {};
      if (amountMin) {
        filter.amount.$gte = parseFloat(amountMin);
      }
      if (amountMax) {
        filter.amount.$lte = parseFloat(amountMax);
      }
    }

    // ✅ User filter
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID.",
        });
      }
      filter.user = userId;
    }

    // ✅ Fetch payments with filters
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email profile')
      .populate("instanceId", "instanceName status")
      .lean();

    // ✅ Total count with same filters
    const totalPayments = await Payment.countDocuments(filter);

    // ✅ Calculate statistics
    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          successfulPayments: { 
            $sum: { $cond: [{ $eq: ["$status", "success"] }, 1, 0] } 
          },
          failedPayments: { 
            $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } 
          },
          pendingPayments: { 
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } 
          },
          averageAmount: { $avg: "$amount" }
        }
      }
    ]);

    const statistics = stats.length > 0 ? stats[0] : {
      totalAmount: 0,
      successfulPayments: 0,
      failedPayments: 0,
      pendingPayments: 0,
      averageAmount: 0
    };

    return res.status(200).json({
      message: "Payments fetched successfully",
      success: true,
      payments,
      statistics: {
        totalAmount: statistics.totalAmount,
        successfulPayments: statistics.successfulPayments,
        failedPayments: statistics.failedPayments,
        pendingPayments: statistics.pendingPayments,
        averageAmount: Math.round(statistics.averageAmount * 100) / 100
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalPayments / limitNum),
        totalPayments,
        hasNext: pageNum < Math.ceil(totalPayments / limitNum),
        hasPrev: pageNum > 1,
        limit: limitNum
      }
    });

  } catch (err) {
    console.error("Error fetching payments:", err);
    return res.status(500).json({
      message: "Server error while fetching payments",
      success: false,
    });
  }
};

// ✅ Get payment details for admin
export const getPaymentDetailsForAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    const { id } = req.params;

    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view payment details.",
      });
    }

    // ✅ Validate payment ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid payment ID is required.",
      });
    }

    // ✅ Fetch payment details
    const payment = await Payment.findById(id)
      .populate('user', 'name email profile phoneNumber')
      .populate("instanceId", "instanceName status masterWorkflow")
      .populate({
        path: "instanceId",
        populate: {
          path: "masterWorkflow",
          select: "name category description"
        }
      })
      .lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment details fetched successfully.",
      payment
    });

  } catch (error) {
    console.error("Error fetching payment details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching payment details.",
    });
  }
};