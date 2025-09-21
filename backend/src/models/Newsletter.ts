import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
     
    },
    status: {
      type: String,
      enum: ["SUBSCRIBED", "UNSUBSCRIBED"],
      default: "SUBSCRIBED",
      index: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Prevent OverwriteModelError in dev hot-reloads
export default mongoose.models.Newsletter ||
  mongoose.model("Newsletter", NewsletterSchema);
