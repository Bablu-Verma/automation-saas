"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const ContactUs_1 = __importDefault(require("../../../models/ContactUs"));
const constant_1 = require("../../../utils/constant");
const contact_form_submission_email_1 = require("../../../email/contact_form_submission_email");
const createContact = async (req, res) => {
    try {
        const { name, email, message, number, subject } = req.body;
        if (!name || !email || !message || !number || !subject) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required.",
            });
        }
        if (!email || !constant_1.emailRegex.test(email)) {
            return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
        }
        if (!number || !constant_1.phoneRegex.test(number)) {
            return res.status(400).json({ success: false, msg: 'Please enter a valid email number.' });
        }
        const contact = await ContactUs_1.default.create({ name, email, message, number: Number(number), subject });
        await (0, contact_form_submission_email_1.contact_form_submission_email)(email, name, subject);
        return res.status(201).json({
            success: true,
            message: "Contact submitted successfully.",
            data: contact,
        });
    }
    catch (error) {
        console.error("Error creating contact:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating contact.",
        });
    }
};
exports.createContact = createContact;
