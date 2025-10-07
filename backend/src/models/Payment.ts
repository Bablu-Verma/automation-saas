import mongoose from "mongoose";
const { Schema } = mongoose;
import { v4 as uuidv4 } from 'uuid';

const PaymentSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },

  orderId:{
    type:String,
    default:uuidv4()
  },
 
  instanceId: { 
    type: Schema.Types.ObjectId, 
    ref: "AutomationInstance", 
    required: true 
  },

  subscriptionMonths: { 
    type: Number, 
    required: true,
    min: 1 
  },
  
  period: {
    startDate: { 
      type: Date, 
     
    },
    endDate: { 
      type: Date, 
      
    },
  },

  planDetails: {
    name: String,
    duration: Number,
    price: Number,
    discountPercentage: Number
  },

  amountDetails: {
    baseAmount: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 }
  },

  currency: { 
    type: String, 
    default: "INR",
    enum: ["INR", "USD"] 
  },

  paymentMethod: { 
    type: String,
    enum: ["card", "upi", "netbanking", "wallet"] 
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded", "cancelled"],
    default: "pending",
  },


}, { 
  timestamps: true 
});


export default mongoose.model("Payment", PaymentSchema);

