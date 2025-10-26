import mongoose, { Model } from "mongoose";
import { INewsletter } from "../types/types";

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
 const Newsletter = mongoose.model<INewsletter>("Newsletter", NewsletterSchema);

  export default Newsletter
