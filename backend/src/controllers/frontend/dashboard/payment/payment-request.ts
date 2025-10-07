import { Response } from "express";
import mongoose from "mongoose";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import AutomationInstance from "../../../../models/AutomationInstance";

import MasterWorkflow from "../../../../models/MasterWorkflow"; // Adjust path as needed
import Payment from "../../../../models/Payment";



// Create Payment - Robust Version
export const createPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      instanceId,
      subscriptionMonths,
      planDetails,
      amountDetails,
      currency,
      paymentMethod
    } = req.body;

    console.log('Payment creation request:', req.body);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    // Validate required fields
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

    // Validate amountDetails structure
    if (!amountDetails.totalAmount || !amountDetails.baseAmount) {
      return res.status(400).json({
        message: "Amount details must include baseAmount and totalAmount",
        success: false
      });
    }

    // Get automation instance to verify ownership and get serviceId
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



    // Prepare payment data
    const paymentData: any = {
      user: userId,
      instanceId: instanceId,
      subscriptionMonths: subscriptionMonths,
     
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
        subtotal: amountDetails.subtotal || (amountDetails.baseAmount - (amountDetails.discountAmount || 0)),
        taxPercentage: amountDetails.taxPercentage || 0
      },
      currency: currency || "INR",
      paymentMethod: paymentMethod || "upi",
      status: "pending"
    };

    // Create and save payment
    const payment = new Payment(paymentData);
    await payment.save();

   
    console.log('Payment created successfully with ID:', payment._id);

    return res.status(201).json({
      message: "Payment request created successfully, our team will respond shortly",
      success: true,
      data:{
        id:payment._id
      }
      
    });

  } catch (err: any) {
    console.error("Error creating payment:", err);
    
    // Handle duplicate payment or validation errors
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Payment already exists for this instance",
        success: false
      });
    }
    
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




