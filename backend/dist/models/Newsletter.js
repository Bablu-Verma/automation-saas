"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NewsletterSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["SUBSCRIBED", "UNSUBSCRIBED"],
        default: "SUBSCRIBED",
        index: true,
    },
}, {
    timestamps: true,
});
// Prevent OverwriteModelError in dev hot-reloads
const Newsletter = mongoose_1.default.model("Newsletter", NewsletterSchema);
exports.default = Newsletter;
