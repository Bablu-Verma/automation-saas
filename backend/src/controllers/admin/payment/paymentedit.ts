import { Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import Payment from "../../../models/Payment";
import AutomationInstance from "../../../models/AutomationInstance";
import { toggleN8nWorkflow } from "../../../lib/_n8n_helper";
import { sendPaymentStatusEmail } from "../../../email/sendPaymentStatusEmail";
import { IAutomationInstance, IUser } from "../../../types/types";

export const updatePaymentForAdmin = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const admin = req.user;
    const { id, status, note, paymentMethod } = req.body;

    /* ===== ACCESS CONTROL ===== */
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    /* ===== VALIDATION ===== */
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid payment ID required",
      });
    }

    const allowedStatuses = ["success", "failed", "refunded", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    const allowedMethods = ["card", "upi", "netbanking", "wallet", "manual", "internal"];
    if (paymentMethod && !allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method`,
      });
    }

    /* ===== FETCH PAYMENT ===== */
    const payment = await Payment.findById(id)
      .populate<{ instanceId: IAutomationInstance }>(
        "instanceId",
        "instanceName user n8nWorkflowId periods systemStatus isActive"
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    /* ===== FETCH AUTOMATION ===== */
    const automation = await AutomationInstance.findById(
      payment.instanceId
    ).populate<{ user: IUser }>("user", "name email");

    if (!automation) {
      return res.status(404).json({
        success: false,
        message: "Automation instance not found",
      });
    }

    /* ===== INIT ===== */
    if (!payment.logs) payment.logs = [];
    if (!payment.period) payment.period = {};

    let pauseWorkflow = false;
    const now = new Date();

    /* ===== STATUS HANDLING ===== */
    if (status === "success") {
      // 🔓 ACTIVATE SUBSCRIPTION
      const startDate =
        payment.period.startDate && payment.period.startDate > now
          ? payment.period.startDate
          : now;

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + payment.subscriptionMonths);

      payment.period.startDate = startDate;
      payment.period.endDate = endDate;

      automation.systemStatus = "ACTIVE";
      automation.isActive = "RUNNING";

      automation.periods = {
        startTime: startDate,
        endTime: endDate,
      };

      pauseWorkflow = false;

      if (paymentMethod) {
        payment.paymentMethod = paymentMethod;
      }
    }

    if (["failed", "refunded", "cancelled"].includes(status)) {
      // 🔒 EXPIRE SUBSCRIPTION
      payment.period.endDate = now;

      automation.systemStatus = "EXPIRED";
      automation.isActive = "PAUSE";

      automation.periods = {
        startTime: automation.periods?.startTime || now,
        endTime: now,
      };

      pauseWorkflow = true;
    }

    /* ===== SAVE PAYMENT ===== */
    payment.status = status;
    if (note) payment.note = note;

    payment.logs.push({
      status,
      note: note || `Admin updated status to ${status}`,
      changedAt: now,
    });

    await payment.save();

    /* ===== SAVE AUTOMATION ===== */
    await automation.save();

    /* ===== TOGGLE WORKFLOW ===== */
    try {
      await toggleN8nWorkflow(
        automation.n8nWorkflowId,
        !pauseWorkflow
      );
    } catch (err) {
      console.error("n8n toggle failed", err);
    }

    /* ===== EMAIL USER ===== */
    await sendPaymentStatusEmail(
      automation.user.email,
      automation.user.name,
      payment
    );

    return res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: {
        paymentId: payment._id,
        status: payment.status,
        period: payment.period,
      },
    });
  } catch (error) {
    console.error("Admin payment update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating payment",
    });
  }
};
