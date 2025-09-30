import mongoose from "mongoose";
const { Schema } = mongoose;

const InstanceValueSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    masterWorkflow: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },
    userInputs: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],

    n8nCredential: [
      { 
        cradentialName: { type: String }, 
        credentialId: { type: String }, 
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("InstanceValue", InstanceValueSchema);
