"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("../../../config/firebase_admin"));
const User_1 = __importDefault(require("../../../models/User"));
const jsonwebtoken_1 = require("../../../lib/jsonwebtoken_");
const user_welcome_email_1 = require("../../../email/user_welcome_email");
const loginWithGoogle = async (req, res) => {
    const { google_token } = req.body;
    if (!google_token) {
        return res
            .status(400)
            .json({ success: false, msg: "google_token is required." });
    }
    try {
        // 1. Verify token with Firebase Admin
        const decoded = await firebase_admin_1.default.auth().verifyIdToken(google_token);
        const { email, name } = decoded;
        if (!email) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid Google token (no email found)." });
        }
        let user = await User_1.default.findOne({ email });
        // 2. If user exists → LOGIN
        if (user) {
            if (user.status === "banned") {
                return res.status(403).json({
                    success: false,
                    msg: "Your account is banned. Contact support.",
                    action: "CONTACT_SUPPORT",
                });
            }
            if (user.status === "deleted") {
                return res.status(403).json({
                    success: false,
                    msg: "This account has been permanently deleted.",
                    action: "NOT_APPLICABLE",
                });
            }
            if (user.status === "delete_request") {
                return res.status(403).json({
                    success: false,
                    msg: "This account has been request deleted.",
                    action: "NOT_APPLICABLE",
                });
            }
            if (user.status === "inactive") {
                user.status = 'active';
                await user.save();
                const token = (0, jsonwebtoken_1.jsonwebtoken_create)({
                    _id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                }, "15d");
                return res.status(200).json({
                    success: true,
                    msg: "Login successful",
                    action: "LOGIN",
                    token,
                    user: user
                });
            }
            if (user.status === "active") {
                const token = (0, jsonwebtoken_1.jsonwebtoken_create)({
                    _id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                }, "15d");
                return res.status(200).json({
                    success: true,
                    msg: "Login successful",
                    action: "LOGIN",
                    token,
                    user: user
                });
            }
        }
        // 3. If no user → REGISTER
        user = new User_1.default({
            name: name || "Google User",
            email,
            password: "GOOGLE_REGISTER",
            status: "active",
            role: "user",
        });
        await user.save();
        await (0, user_welcome_email_1.user_welcome_email)(user.email, user.name);
        const token = (0, jsonwebtoken_1.jsonwebtoken_create)({
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
        }, "15d");
        return res.status(201).json({
            success: true,
            msg: "Registration successful",
            action: "REGISTER",
            token,
            user: user
        });
    }
    catch (err) {
        console.error("Google login error:", err.message);
        return res
            .status(500)
            .json({ success: false, msg: "Server error during Google login." });
    }
};
exports.default = loginWithGoogle;
