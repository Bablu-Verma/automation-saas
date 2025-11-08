"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHashedPassword = exports.NEW_OTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const NEW_OTP = () => {
    return crypto_1.default.randomInt(100000, 999999).toString();
};
exports.NEW_OTP = NEW_OTP;
const createHashedPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    return hashedPassword;
};
exports.createHashedPassword = createHashedPassword;
