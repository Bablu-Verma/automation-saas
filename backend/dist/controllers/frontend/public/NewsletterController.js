"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsubscribeNewsletter = exports.subscribeNewsletter = void 0;
const Newsletter_1 = __importDefault(require("../../../models/Newsletter"));
const send_newsletter_subscription_email_1 = require("../../../email/send_newsletter_subscription_email");
// ✅ Subscribe (POST /newsletter/subscribe)
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        // find if exists
        let subscriber = await Newsletter_1.default.findOne({ email });
        if (subscriber) {
            if (subscriber.status === "UNSUBSCRIBED") {
                subscriber.status = "SUBSCRIBED";
                await subscriber.save();
                return res.status(200).json({
                    success: true,
                    message: "Resubscribed successfully.",
                    data: subscriber,
                });
            }
            return res.status(200).json({
                success: true,
                message: "Already subscribed.",
                data: subscriber,
            });
        }
        // create new subscriber
        subscriber = await Newsletter_1.default.create({ email });
        await (0, send_newsletter_subscription_email_1.send_newsletter_subscription_email)(email);
        return res.status(201).json({
            success: true,
            message: "Subscribed successfully.",
            data: subscriber,
        });
    }
    catch (error) {
        console.error("Error subscribing:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while subscribing.",
        });
    }
};
exports.subscribeNewsletter = subscribeNewsletter;
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }
        const subscriber = await Newsletter_1.default.findOneAndUpdate({ email }, { status: "UNSUBSCRIBED" }, { new: true });
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Subscriber not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Unsubscribed successfully.",
            data: subscriber,
        });
    }
    catch (error) {
        console.error("Error unsubscribing:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while unsubscribing.",
        });
    }
};
exports.unsubscribeNewsletter = unsubscribeNewsletter;
