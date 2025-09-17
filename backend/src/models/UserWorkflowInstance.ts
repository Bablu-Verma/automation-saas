import mongoose from 'mongoose'
const { Schema } = mongoose;

const userWorkflowInstanceSchema = new Schema({
   
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
   
    masterWorkflow: {
        type: Schema.Types.ObjectId,
        ref: 'MasterWorkflow',
        required: true
    },
   
    n8nWorkflowId: {
        type: String,
        required: true,
        unique: true
    },

    instanceName: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
   
    userCredentials: [{
        serviceName: String, 
        n8nCredentialId: String 
    }],
}, {
    timestamps: true
});

const UserWorkflowInstance = mongoose.model('UserWorkflowInstance', userWorkflowInstanceSchema);
module.exports = UserWorkflowInstance;