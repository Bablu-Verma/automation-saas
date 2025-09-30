import mongoose from "mongoose";
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
    service: { type: String },          // e.g. "Google Sheets"
    label: { type: String },            // e.g. "Google OAuth2"
    inputType: { type: String },        // "oauth2" | "apikey" | "httpBasic"
    credentialType: { type: String },   // e.g. "googleSheetsOAuth2Api"
    scopes: { type: [String] },         // For OAuth2 (optional)
    fields: [                           // 👈 New: define actual fields
      {
        name: { type: String },         // field key (e.g. "clientId")
        label: { type: String },        // UI label (e.g. "Client ID")
        inputType: { type: String },    // "text" | "password" | "token"
        required: { type: Boolean }
      }
    ],
    inject: [
      {
        node: { type: String },         // node name to inject into
        field: { type: String }         // node field name
      }
    ]
  }
]

}, { timestamps: true });

export default mongoose.model("MasterWorkflow", MasterWorkflowSchema);

