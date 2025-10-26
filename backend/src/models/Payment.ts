import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { IPayment, IPaymentLog } from "../types/types";
import { Model } from "mongoose";



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
    orderId: { type: String, default: () => uuidv4() },
    instanceId: { type: mongoose.Schema.Types.ObjectId, ref: "AutomationInstance", required: true },
    subscriptionMonths: { type: Number, required: true, min: 1 },

    period: { startDate: Date, endDate: Date },
    planDetails: { name: String, duration: Number, price: Number, discountPercentage: Number },
    amountDetails: {
      baseAmount: { type: Number, required: true, min: 0 },
      discountAmount: { type: Number, default: 0, min: 0 },
      taxAmount: { type: Number, default: 0, min: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
    },

    currency: { type: String, enum: ["INR", "USD"], default: "INR" },
    paymentMethod: { type: String, enum: ["card", "upi", "netbanking", "wallet", "manual", "internal"] },

    status: { type: String, enum: ["pending", "success", "failed", "refunded", "cancelled"], default: "pending", required: true, index: true },
    note: { type: String },
    Log: { type: [PaymentLogSchema], default: [] },
  },
  { timestamps: true }
);

 const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);

 export default Payment

