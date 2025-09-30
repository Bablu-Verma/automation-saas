import mongoose from "mongoose";
const { Schema } = mongoose;

const PymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },
  instanceId: { type: mongoose.Schema.Types.ObjectId, ref: "AutomationInstance", required: true },

  invoiceId: { type: String, required: true, unique: true },
  transactionId: { type: String },

  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "USD" },

  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: { type: String },
  

  periodStart: { type: Date },
  periodEnd: { type: Date },

}, { timestamps: true });

export default mongoose.model("Pyment", PymentSchema);
