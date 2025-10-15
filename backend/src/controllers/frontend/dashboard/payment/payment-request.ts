import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";
import Payment from "../../../../models/Payment";

export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const {
            instanceId,
            subscriptionMonths,
            planDetails,
            amountDetails,
            currency,
            paymentMethod,
            note 
        } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        const missingFields = [];
        if (!instanceId) missingFields.push("instanceId");
        if (!subscriptionMonths) missingFields.push("subscriptionMonths");
        if (!amountDetails) missingFields.push("amountDetails");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
                success: false
            });
        }

        if (!amountDetails.totalAmount || !amountDetails.baseAmount) {
            return res.status(400).json({
                message: "Amount details must include baseAmount and totalAmount",
                success: false
            });
        }

        const automationInstance = await AutomationInstance.findOne({
            _id: instanceId,
            user: userId
        });

        if (!automationInstance) {
            return res.status(404).json({
                message: "Automation instance not found or you don't have permission",
                success: false
            });
        }

        let startDate: Date;
        const currentDate = new Date();
        const instanceEnd = automationInstance.periods?.endTime
            ? new Date(automationInstance.periods.endTime)
            : null;

        if (!instanceEnd || instanceEnd < currentDate) {
            startDate = currentDate;
        } else {
            startDate = new Date(instanceEnd);
            startDate.setDate(startDate.getDate() + 1);
        }

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + subscriptionMonths);

        const initialStatus = "pending";
        const initialNote = note || "Initial payment request created.";

        const paymentData: any = {
            user: userId,
            instanceId,
            subscriptionMonths,
            period: { startDate, endDate },
            planDetails: {
                name: planDetails?.name || `${subscriptionMonths} Month Plan`,
                duration: planDetails?.duration || subscriptionMonths,
                price: planDetails?.monthlyPrice || planDetails?.price || 0,
                discountPercentage: planDetails?.discountPercentage || 0
            },
            amountDetails: {
                baseAmount: amountDetails.baseAmount || 0,
                discountAmount: amountDetails.discountAmount || 0,
                taxAmount: amountDetails.taxAmount || 0,
                totalAmount: amountDetails.totalAmount || 0,
            },
            currency: currency || "INR",
            paymentMethod: paymentMethod || "manual", 
            
            status: initialStatus,
          
            note: note,
            Log: [{
                status: initialStatus,
                note: initialNote,
                changedAt: new Date()
            }]
        };

        const payment = await new Payment(paymentData).save();

        return res.status(201).json({
            message: "Payment request created successfully (Status: Pending)",
            success: true,
            data: { 
                paymentId: payment._id, 
                orderId: payment.orderId,
                status: payment.status 
            }
        });

    } catch (err: any) {
        console.error("Error creating payment:", err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: `Validation error: ${err.message}`,
                success: false
            });
        }

        return res.status(500).json({
            message: "Server error while creating payment",
            success: false,
        });
    }
};
