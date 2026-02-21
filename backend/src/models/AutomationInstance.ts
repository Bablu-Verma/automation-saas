import mongoose from "mongoose";
import { IAutomationInstance } from "../types/types";
const { Schema } = mongoose;

const AutomationInstanceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    masterWorkflow: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },
    n8nWorkflowId: { type: String, required: true, index: true },

    instanceName: { type: String, required: true },
    instanceId: { type: String, required: true },

    isActive: {
      type: String,
      enum: ["RUNNING", "PAUSE"],
      default: "PAUSE",
    },

    systemStatus: {
      type: String,
      enum: ["TRIAL", "ACTIVE", 'EXPIRE_SOON', 'NEED_PAYMENT', 'EXPIRED', 'USAGE_LIMIT_EXCEEDED', 'CONTACT_SUPPORT'],
      default: "TRIAL",
      index: true,
    },

    selectedPlanDetails: {
      planName: String,
      monthlyPrice: Number,
      payAmount: Number,
      discountPercent: Number,
      usageLimit: Number, 
      validityDays: Number
    },

    usageCount: { type: Number, default: 0 },

    periods: {
      startTime: Date,
      endTime: Date,
    },

    trigger: [{
      type: String
    }],

    userCredentialsId: [String],
   
    lastExecutedAt: { type: Date },
  },
  { timestamps: true }
);

const AutomationInstance = mongoose.model<IAutomationInstance>("AutomationInstance", AutomationInstanceSchema);

export default AutomationInstance
