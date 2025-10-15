import { Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import Payment from "../../../../models/Payment";

export const getPaymentDetails = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { paymentId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({ message: "Invalid payment ID", success: false });
    }

    // 🔍 Fetch payment with population
    const payment = await Payment.findOne({ _id: paymentId, user: userId })
      .populate("user", "name email profile")
      .populate("instanceId", "instanceName status")
      .lean();

    if (!payment) {
      return res.status(404).json({ message: "Payment not found", success: false });
    }

    return res.status(200).json({
      message: "Payment details fetched successfully",
      success: true,
      payment,
    });

  } catch (err) {
    console.error("Error fetching payment details:", err);
    return res.status(500).json({
      message: "Server error while fetching payment details",
      success: false,
    });
  }
};
