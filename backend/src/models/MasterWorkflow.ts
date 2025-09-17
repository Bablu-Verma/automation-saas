import mongoose from 'mongoose';
const { Schema } = mongoose;

const masterWorkflowSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
   
    workflowJsonTemplate: {
        type: Object,
        required: true
    },
    
    serviceIconUrl: {
        type: String,
    },
    version: {
        type: Number,
        default: 1
    },
    category:{
      type:String,
      require:true
    },
    isPublished: { 
        type: Boolean,
        default: false
    },
     // 👇 userInputs (static values)
  requiredInputs: [
    {
      key: { type: String, required: true },      
      label: { type: String, required: true },    
      type: { type: String, default: "string" },  
      placeholder: { type: String },             
      required: { type: Boolean, default: true }
    }
  ],

  // 👇 service credentials
  requiredCredentials: [
    {
      service: { type: String, required: true },   
      label: { type: String, required: true },     
      type: { type: String, default: "oauth2" }  
    }
  ]
}, {
    timestamps: true
});

const MasterWorkflow = mongoose.model('MasterWorkflow', masterWorkflowSchema);
export default MasterWorkflow;