"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
