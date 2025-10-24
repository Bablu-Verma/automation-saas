import mongoose, { Model } from "mongoose";
import { IMasterWorkflow } from "../types/types";
const { Schema } = mongoose;

const MasterWorkflowSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  slug:{
       type: String, required: true, unique: true, index: true
    },
  workflowJsonTemplate: { type: Object, required: true },
  serviceImage: { type: String },

  version: { type: Number, default: 1 },
  keyword: [{ type: String, trim: true }], 

  isPublished: {
    type: String,
    enum: ["ACTIVE", "PAUSE"],
    default: "PAUSE",
  },

  pricePerMonth: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  
  trialDays: { type: Number, default: 7 },

  requiredInputs: [
    {
      key: { type: String},
      label: { type: String },
      inject: [{ node: String, field: String }]
    },
  ],

 requiredCredentials: [
  {
    service: { type: String },         
    label: { type: String },            
    credentialType: { type: String },   
    scopes: { type: [String] },         
    fields: [                           
      {
        name: { type: String },       
        label: { type: String },        
        inputType: { type: String },    
        disabled: { type: Boolean },
        require: { type: Boolean },
        defaultValue:{type:String, default:''}
      }
    ],
    inject: [
      {
        node: { type: String },        
        field: { type: String }         
      }
    ]
  }
]

}, { timestamps: true });

const MasterWorkflow = mongoose.model<IMasterWorkflow>("MasterWorkflow", MasterWorkflowSchema);

export default MasterWorkflow;

