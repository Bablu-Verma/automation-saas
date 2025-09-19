import mongoose from "mongoose";
const { Schema } = mongoose;

const ExecutionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  automationId: { type: Schema.Types.ObjectId, ref: "AutomationInstance", required: true, index: true },

  n8nExecutionId: { type: String, index: true },
  status: { type: String, enum: ["success", "failed", "running"], default: "running" },

  executionData: { type: Object },
  finishedAt: { type: Date },
}, {
  timestamps: { createdAt: "startedAt", updatedAt: false }
});

export default mongoose.model("Execution", ExecutionSchema);
