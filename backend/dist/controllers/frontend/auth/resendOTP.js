"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("../../../lib/jsonwebtoken_");
const User_1 = __importDefault(require("../../../models/User"));
const utils_1 = require("../../../utils/utils");
const user_verify_1 = require("../../../email/user_verify");
const resendOtpController = async (req, res) => {
    try {
        const decoded = await (0, jsonwebtoken_1.jsonwebtoken_decoded)(req, res);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found. The account may have been deleted.",
                action: "REGISTER",
            });
        }
        if (user.status === "active") {
            return res.status(400).json({
                success: false,
                msg: "This account is already verified. Please log in.",
                action: "LOGIN",
            });
        }
        // Check for other non-verifiable statuses
        if (user.status === "banned" || user.status === "deleted") {
            return res.status(403).json({
                success: false,
                msg: "This account cannot be verified.",
                action: "CONTACT_SUPPORT",
            });
        }
        let OTP = (0, utils_1.NEW_OTP)();
        // Save the newly generated OTP to the user's document
        user.otp = Number(OTP);
        await user.save();
        // 5. --- Send the New OTP via Email ---
        await (0, user_verify_1.user_verify_email)(OTP, user.email);
        // 6. --- Send Success Response ---
        res.status(200).json({
            success: true,
            msg: 'A new verification OTP has been successfully sent to your email.',
        });
    }
    catch (err) {
        // Handle token expiration or other verification errors
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, msg: 'Invalid or expired token. Please try registering again.' });
        }
        console.error("Resend OTP Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
exports.default = resendOtpController;
