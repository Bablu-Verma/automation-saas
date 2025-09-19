import mongoose from "mongoose";
const { Schema } = mongoose;

const AutomationInstanceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  masterWorkflow: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },
  subscription: { type: Schema.Types.ObjectId, ref: "Subscription", required: true },

  n8nWorkflowId: { type: String, required: true, index: true },
  instanceName: { type: String, required: true },
  
  isActive: {  type: String,
    enum: ["ACTIVE", "PAUSE"],
    default: "PAUSE",
   },

  // User credentials for this instance
  userCredentials: [
    {
      serviceName: String,
      n8nCredentialId: String,
    },
  ],

  // Stats
  executionCount: { type: Number, default: 0 },
  lastExecutedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("AutomationInstance", AutomationInstanceSchema);
