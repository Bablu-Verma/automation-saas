"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonwebtoken_decoded = exports.jsonwebtoken_create = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jsonwebtoken_create = (user, time) => {
    return jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || '', { expiresIn: time });
};
exports.jsonwebtoken_create = jsonwebtoken_create;
const jsonwebtoken_decoded = async (req, res) => {
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
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    return decoded;
};
exports.jsonwebtoken_decoded = jsonwebtoken_decoded;
