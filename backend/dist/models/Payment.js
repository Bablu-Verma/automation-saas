"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const PaymentLogSchema = new mongoose_1.default.Schema({
    status: { type: String, enum: ["pending", "success", "failed", "refunded", "cancelled"], required: true },
    note: { type: String },
    changedAt: { type: Date, default: Date.now },
}, { _id: false });
const PaymentSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: String, default: () => (0, uuid_1.v4)() },
    instanceId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "AutomationInstance", required: true },
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
}, { timestamps: true });
const Payment = mongoose_1.default.model("Payment", PaymentSchema);
exports.default = Payment;
