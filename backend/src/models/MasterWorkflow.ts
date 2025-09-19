import mongoose from "mongoose";
const { Schema } = mongoose;

const MasterWorkflowSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },

  workflowJsonTemplate: { type: Object, required: true },
  serviceImage: { type: String },

  version: { type: Number, default: 1 },
  category: { type: String, required: true },

  isPublished: {
    type: String,
    enum: ["ACTIVE", "PAUSE"],
    default: "PAUSE",
  },

  // Monetization
  pricePerMonth: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  trialDays: { type: Number, default: 7 },

  // What inputs user must provide
  requiredInputs: [
    {
      key: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, default: "string" },
      placeholder: { type: String },
      required: { type: Boolean, default: true },
    },
  ],

  // What credentials user must connect
  requiredCredentials: [
    {
      service: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, default: "oauth2" },
    },
  ],
}, { timestamps: true });

export default mongoose.model("MasterWorkflow", MasterWorkflowSchema);
