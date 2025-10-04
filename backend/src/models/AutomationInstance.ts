import mongoose from "mongoose";
const { Schema } = mongoose;

const AutomationInstanceSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    masterWorkflow: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },

    subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },

    n8nWorkflowId: { type: String, required: true, index: true },
    instanceName: { type: String, required: true },

    isActive: {
      type: String,
      enum: ["RUNNING", "PAUSE"],
      default: "PAUSE",
    },

    systemStatus: {
      type: String,
      enum: ["TRIAL", "ACTIVE", 'PAID_PENDING', 'EXPIRED', 'CONTACT_SUPPORT'],
      default: "TRIAL",
      index: true,
    },

    periods: {
      startTime: Date,
      endTime: Date,
    },

    n8nInputs: [
      {
        key: { type: String },
        value: { type: String },
        inject: [{ node: String, field: String }]
      },
    ],

    n8nCredentials: [
      {
        service: { type: String },
        label: { type: String },
        n8nCredentialId: { type: String },
        n8nCredentialName: { type: String },
        inject: [
          {
            node: { type: String },
            field: { type: String }
          }
        ]
      }
    ],
    
    executionCount: { type: Number, default: 0 },
    lastExecutedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("AutomationInstance", AutomationInstanceSchema);
