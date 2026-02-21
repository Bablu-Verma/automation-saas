import mongoose from "mongoose";
import { IPayment, IPaymentLog } from "../types/types";



const PaymentLogSchema = new mongoose.Schema<IPaymentLog>(
  {
    status: { type: String, enum: ["pending", "success", "failed", "refunded", "cancelled"], required: true },
    note: { type: String },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema<IPayment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    orderId: { type: String, unique: true },

    instanceId: { type: mongoose.Schema.Types.ObjectId, ref: "AutomationInstance", required: true },
    
    subscriptionMonths: { type: Number, required: true, min: 1 },

    period: {
      startDate: Date,
      endDate: Date,
    },

    planDetails: {
      name: String,
      monthlyPrice: Number,
      months: Number,
      discountPercentage: Number,
    },

    amountDetails: {
      baseAmount: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      subtotal: { type: Number, required: true },
      taxPercentage: { type: Number, required: true },
      taxAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },

    currency: { type: String, enum: ["INR", "USD"], default: "INR" },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "manual", "internal"],
    },

    transactionId: { type: String },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded", "cancelled"],
      default: "pending",
      index: true,
    },

    note: String,

    logs: { type: [PaymentLogSchema], default: [] },
  },
  { timestamps: true }
);


 const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

 export default Payment

