"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneRegex = exports.emailRegex = exports.passwordRegex = void 0;
exports.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
exports.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
exports.phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
