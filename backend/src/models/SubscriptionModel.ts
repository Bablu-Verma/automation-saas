import mongoose from "mongoose";
const { Schema } = mongoose;

const SubscriptionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  service: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true, index: true },

  status: {
    type: String,
    enum: ["trial", "active", "inactive", "canceled"],
    default: "trial",
  },
  plan: { type: String, enum: ["free-trial", "paid"], default: "free-trial" },

  trialStart: { type: Date, default: Date.now },
  trialEnd: { type: Date },

  startDate: { type: Date },
  endDate: { type: Date },

  automationInstance: { type: Schema.Types.ObjectId, ref: "AutomationInstance" },
}, { timestamps: true });

export default mongoose.model("Subscription", SubscriptionSchema);
