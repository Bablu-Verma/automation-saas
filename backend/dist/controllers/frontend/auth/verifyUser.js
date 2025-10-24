"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("../../../lib/jsonwebtoken_");
const User_1 = __importDefault(require("../../../models/User"));
const user_welcome_email_1 = require("../../../email/user_welcome_email");
const verifyUser = async (req, res) => {
    const { otp } = req.body;
    try {
        const decoded = await (0, jsonwebtoken_1.jsonwebtoken_decoded)(req, res);
        const user = await User_1.default.findById(decoded.id).select('+otp');
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found. Please register first.",
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
        if (user.status === "banned" || user.status === "deleted") {
            return res.status(403).json({
                success: false,
                msg: "This account cannot be verified.",
                action: "CONTACT_SUPPORT",
            });
        }
        // Check if OTP expired (30 min since last update)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (user.updatedAt < thirtyMinutesAgo) {
            return res.status(400).json({
                success: false,
                msg: "OTP has expired. Please request a new one.",
                action: "RESEND_OTP",
            });
        }
        // OTP check
        if (user.otp?.toString() !== otp.toString()) {
            return res.status(400).json({
                success: false,
                msg: "Invalid OTP. Please try again.",
            });
        }
        // Mark account as active
        user.status = "active";
        user.otp = undefined;
        await user.save();
        await (0, user_welcome_email_1.user_welcome_email)(user.email, user.name);
        // Issue fresh JWT token
        const newToken = (0, jsonwebtoken_1.jsonwebtoken_create)({
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
        }, "5d" // verified users get longer expiry
        );
        return res.status(200).json({
            success: true,
            msg: "Account verified successfully.",
            action: "LOGIN",
            token: newToken,
        });
    }
    catch (err) {
        console.error("error", err.message);
        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token.",
        });
    }
};
exports.default = verifyUser;
