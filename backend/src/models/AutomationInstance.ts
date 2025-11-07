import mongoose from "mongoose";
import { IAutomationInstance } from "../types/types";
const { Schema } = mongoose;

const AutomationInstanceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    masterWorkflow: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },

    n8nWorkflowId: { type: String, required: true, index: true },
    instanceName: { type: String, required: true },

    isActive: {
      type: String,
      enum: ["RUNNING", "PAUSE"],
      default: "PAUSE",
    },

    systemStatus: {
      type: String,
      enum: ["TRIAL", "ACTIVE", 'NEED_PAYMENT', 'EXPIRED', 'EXPIRE_SOON', 'CONTACT_SUPPORT'],
      default: "TRIAL",
      index: true,
    },

    periods: {
      startTime: Date,
      endTime: Date,
    },

    trigger: [{
      type: String
    }],

    userCredentialsId: [String],

    executionCount: { type: Number, default: 0 },
    lastExecutedAt: { type: Date },
  },
  { timestamps: true }
);

const AutomationInstance = mongoose.model<IAutomationInstance>("AutomationInstance", AutomationInstanceSchema);

export default AutomationInstance
