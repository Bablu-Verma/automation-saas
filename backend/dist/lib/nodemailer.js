"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.email_transporter = exports.sender_email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.sender_email = `loopaxis@support.in`;
exports.email_transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_KEY,
    },
});
