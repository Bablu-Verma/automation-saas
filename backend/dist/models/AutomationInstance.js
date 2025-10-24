"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const AutomationInstanceSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    masterWorkflow: { type: Schema.Types.ObjectId, ref: "MasterWorkflow", required: true },
    n8nWorkflowId: { type: String, required: true, index: true },
    instanceName: { type: String, required: true },
    isActive: {
        type: String,
        enum: ["RUNNING", "PAUSE"],
        default: "PAUSE",
    },
    systemStatus: {
        type: String,
        enum: ["TRIAL", "ACTIVE", 'NEED_PAYMENT', 'EXPIRED', 'EXPIRE_SOON', 'CONTACT_SUPPORT'],
        default: "TRIAL",
        index: true,
    },
    periods: {
        startTime: Date,
        endTime: Date,
    },
    executionCount: { type: Number, default: 0 },
    lastExecutedAt: { type: Date },
}, { timestamps: true });
const AutomationInstance = mongoose_1.default.model("AutomationInstance", AutomationInstanceSchema);
exports.default = AutomationInstance;
