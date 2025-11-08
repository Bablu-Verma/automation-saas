"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("../../../lib/jsonwebtoken_");
const User_1 = __importDefault(require("../../../models/User"));
const utils_1 = require("../../../utils/utils");
const constant_1 = require("../../../utils/constant");
const send_password_changed_email_1 = require("../../../email/send_password_changed_email");
const changePassword = async (req, res) => {
    const { password } = req.body;
    try {
        const decoded = await (0, jsonwebtoken_1.jsonwebtoken_decoded)(req, res);
        if (!password || !constant_1.passwordRegex.test(password)) {
            return res.status(400).json({ success: false, msg: 'Password is not strong enough. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).' });
        }
        // Find user from token payload
        const user = await User_1.default.findById(decoded.id);
        if (!user || user.status !== 'active') {
            return res.status(200).json({
                success: true,
                msg: 'Account with that email not exists'
            });
        }
        const hashedPassword = await (0, utils_1.createHashedPassword)(password);
        user.password = hashedPassword;
        await user.save();
        await (0, send_password_changed_email_1.send_password_changed_email)(user.email);
        return res.status(200).json({
            success: true,
            msg: 'Password has been reset successfully. Login Using New Password'
        });
    }
    catch (err) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
exports.default = changePassword;
