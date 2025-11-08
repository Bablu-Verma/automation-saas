"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../../utils/constant");
const User_1 = __importDefault(require("../../../models/User"));
const jsonwebtoken_1 = require("../../../lib/jsonwebtoken_");
const forgot_password_1 = require("../../../email/forgot_password");
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email || !constant_1.emailRegex.test(email)) {
        return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
    }
    try {
        const user = await User_1.default.findOne({ email });
        if (!user || user.status !== 'active') {
            return res.status(200).json({
                success: true,
                msg: 'Account with that email not exists'
            });
        }
        const token = (0, jsonwebtoken_1.jsonwebtoken_create)({
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
        }, "30m");
        let resetURL = `${process.env.CLIENT_URL}/change-password?userid=${token}`;
        await (0, forgot_password_1.send_password_reset_email)(resetURL, user.email);
        return res.status(200).json({
            success: true,
            msg: 'Check your email password reset link has been sent.'
        });
    }
    catch (err) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
exports.default = forgotPassword;
