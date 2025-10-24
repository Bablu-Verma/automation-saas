"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ContactSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: 100,
    },
    number: {
        type: Number,
        required: [true, "Number is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        maxlength: 5000,
    },
    status: {
        type: String,
        enum: ["UN_READ", "READ"],
        default: "UN_READ",
        index: true,
    },
}, {
    timestamps: true,
});
// Prevent OverwriteModelError in dev hot-reloads
const Contact = mongoose_1.default.model("Contact", ContactSchema);
exports.default = Contact;
