import { Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";

import Payment from "../../../../models/Payment";




export const getUserPayments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10 } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const payments = await Payment.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email profile')
      .populate("instanceId", "instanceName status");

    const totalPayments = await Payment.countDocuments({ user: userId });

    return res.status(200).json({
      message: "Payments fetched successfully",
      success: true,
      payments,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalPayments / limitNum),
        totalPayments,
        hasNext: pageNum < Math.ceil(totalPayments / limitNum),
        hasPrev: pageNum > 1
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




