"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCheck = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginCheck = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            msg: 'Authorization token is required.',
        });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({
            success: false,
            msg: 'Server configuration error.',
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, msg: 'Unauthorized: Invalid token.' });
    }
};
exports.loginCheck = loginCheck;
