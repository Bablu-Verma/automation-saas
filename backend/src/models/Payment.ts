import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const { Schema } = mongoose;

const PaymentLogSchema = new Schema({
    status: { 
        type: String, 
        enum: ["pending", "success", "failed", "refunded", "cancelled"],
        required: true
    },
    note: { 
        type: String 
    },
    changedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false }); 

const PaymentSchema = new Schema({

    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: String, default: uuidv4() },
    instanceId: { type: Schema.Types.ObjectId, ref: "AutomationInstance", required: true },
    subscriptionMonths: { type: Number, required: true, min: 1 },

    period: {
        startDate: { type: Date },
        endDate: { type: Date },
    },
    planDetails: { name: String, duration: Number, price: Number, discountPercentage: Number },
    amountDetails: {
        baseAmount: { type: Number, required: true, min: 0 },
        discountAmount: { type: Number, default: 0, min: 0 },
        taxAmount: { type: Number, default: 0, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 }
    },
    currency: { type: String, default: "INR", enum: ["INR", "USD"] },
    paymentMethod: { type: String, enum: ["card", "upi", "netbanking", "wallet", "manual", "internal"] },
    
    status: {
        type: String,
        enum: ["pending", "success", "failed", "refunded", "cancelled"],
        default: "pending", 
        required: true,
        index: true
    },
    
    note: {
        type: String
    },
    
    Log: {
        type: [PaymentLogSchema], 
        default: []
    }

}, {
    timestamps: true
});


export default mongoose.model("Payment", PaymentSchema);