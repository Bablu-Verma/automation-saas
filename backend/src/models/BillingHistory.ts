import mongoose from "mongoose";
const { Schema } = mongoose;

const BillingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  subscription: { type: Schema.Types.ObjectId, ref: "Subscription", required: true, index: true },

  invoiceId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "USD" },

  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: { type: String },
  transactionId: { type: String },

  periodStart: { type: Date },
  periodEnd: { type: Date },
}, { timestamps: true });

export default mongoose.model("Billing", BillingSchema);
