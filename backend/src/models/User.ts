import mongoose, { Schema } from 'mongoose';
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
