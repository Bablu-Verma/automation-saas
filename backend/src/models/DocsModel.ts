import mongoose, { Schema } from "mongoose";


export interface IDocs {
  service_id: mongoose.Types.ObjectId;
  docs: string;
}

const DocsSchema = new Schema<IDocs>(
  {
    service_id: {
      type: Schema.Types.ObjectId,
      ref: "MasterWorkflow",
      required: true,
    },

    docs: {
      type: String,
      trim: true,
      required: true, // recommended
    },
  },
  {
    timestamps: true,
  }
);


const DocsModel = mongoose.model<IDocs>("Docs", DocsSchema);

export default DocsModel;
