import mongoose from 'mongoose';
const { Schema } = mongoose;

const executionSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    
    automationId: {
        type: Schema.Types.ObjectId, 
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'running'],
        default: 'running'
    },
    finishedAt: {
        type: Date
    },
    executionData: {
        type: Object 
    }
}, {
    timestamps: { createdAt: 'startedAt', updatedAt: false }
});

const Execution = mongoose.model('Execution', executionSchema);
export default Execution;