import mongoose, { Schema, Types, Document } from 'mongoose';
import { UserDocument } from '../types/types';


const userSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    profile: {
        company: { type: String, trim: true },
        phoneNumber: { type: String, trim: true },
        address: { type: String, trim: true }
    },
    automations: [{
        masterWorkflow: {
            type: Schema.Types.ObjectId,
            ref: 'MasterWorkflow',
            required: true
        },
        workflowId: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        credentials: {
            type: Object, // Dynamic credentials ke liye Object type
        },
        executionCount: { // Automation ke run hone ka count
            type: Number,
            default: 0
        },
        lastExecutedAt: {
            type: Date
        },
        // Har automation ka apna subscription plan hoga
        subscription: {
            plan: {
                type: String,
                enum: ['free', 'pro'],
                default: 'free'
            },
            status: {
                type: String,
                enum: ['active', 'inactive', 'paused', 'canceled'],
                default: 'inactive'
            },
            planId: String,
            startDate: Date,
            endDate: Date
        }
    }],
    billingHistory: [{
        invoiceId: String,
        amount: Number,
        date: Date,
        status: String
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'banned', 'delete_request', 'deleted'],
        default: 'inactive'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'developer'],
        default: 'user'
    },
    otp: {
        type: Number,
        select: false
    },
}, { timestamps: true });

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;
