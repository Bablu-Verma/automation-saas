import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";
import Payment from "../../../../models/Payment";
import { payment_request_success_email } from "../../../../email/payment_request_success_email";
import { payment_request_success_email_admin_notify } from "../../../../email/payment_request_success_email_admin_notify";
import { generateId } from "../../../../utils/utils";

export const createPayment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    const {
      instanceId,
      subscriptionMonths,
      planDetails,
      amountDetails,
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    

    // 🔹 Basic validation
    if (!instanceId || !subscriptionMonths || !amountDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (
      amountDetails.baseAmount == null ||
      amountDetails.totalAmount == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount details",
      });
    }

    // 🔹 Verify automation instance
    const automationInstance = await AutomationInstance.findOne({
      _id: instanceId,
      user: userId,
    });

    if (!automationInstance) {
      return res.status(404).json({
        success: false,
        message: "Automation instance not found",
      });
    }

    // 🔹 Subscription period calculation
    const now = new Date();
    const currentEnd = automationInstance.periods?.endTime
      ? new Date(automationInstance.periods.endTime)
      : null;

    const startDate =
      !currentEnd || currentEnd < now
        ? now
        : new Date(currentEnd.getTime() + 24 * 60 * 60 * 1000);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + subscriptionMonths);

  
    const order_id =  generateId('ORD')

    const payment = await Payment.create({
      user: userId,
      instanceId,
      orderId: order_id,
      subscriptionMonths,

      period: { startDate, endDate },

      planDetails: {
        name:
          planDetails?.name ||
          `${subscriptionMonths} Month Plan`,
        monthlyPrice: planDetails?.monthlyPrice || 0,
        months: subscriptionMonths,
        discountPercentage:
          planDetails?.discountPercentage || 0,
      },

      amountDetails: {
        baseAmount: amountDetails.baseAmount,
        discountAmount: amountDetails.discountAmount || 0,
        subtotal: amountDetails.subtotal || amountDetails.baseAmount,
        taxPercentage: amountDetails.taxPercentage || 0,
        taxAmount: amountDetails.taxAmount || 0,
        totalAmount: amountDetails.totalAmount,
      },

      paymentMethod: "manual",
      status: "pending",
      note: "Payment request created",
      logs: [
        {
          status: "pending",
          note: "Payment request created",
          changedAt: new Date(),
        },
      ],
    });

    // 🔹 Emails
    if (userEmail) {
      await payment_request_success_email(
        userEmail,
        payment.amountDetails.totalAmount,
        payment.currency,
        payment.orderId
      );
    }

    await payment_request_success_email_admin_notify(
      payment.amountDetails.totalAmount,
      payment.currency,
      payment.orderId
    );

    return res.status(201).json({
      success: true,
      message: "Payment request created (Pending)",
      data: {
        paymentId: payment._id,
        orderId: payment.orderId,
        status: payment.status,
      },
    });
  } catch (err: any) {
    console.error("Create payment error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while creating payment",
    });
  }
};
