"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubscriber = exports.getAllSubscribers = void 0;
const Newsletter_1 = __importDefault(require("../../models/Newsletter"));
const getAllSubscribers = async (req, res) => {
    const requestUser = req.user;
    if (!requestUser || requestUser.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only administrators can view user details.",
        });
    }
    try {
        const { page = 1, limit = 10, status, search = "", fromDate, toDate, } = req.body;
        const skip = (page - 1) * limit;
        // Build filter
        let filter = {};
        // Status filter
        if (status) {
            filter.status = status;
        }
        // Search filter - multiple fields
        if (search) {
            filter.$or = [
                { email: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
            ];
        }
        // Date range filter
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate) {
                filter.createdAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                // Add one day to include the entire toDate
                const endDate = new Date(toDate);
                endDate.setDate(endDate.getDate() + 1);
                filter.createdAt.$lte = endDate;
            }
        }
        // Query database
        const subscribers = await Newsletter_1.default.find(filter)
            .skip(skip)
            .limit(limit);
        const total = await Newsletter_1.default.countDocuments(filter);
        // Get statistics if needed
        const statistics = {
            totalSubscribers: await Newsletter_1.default.countDocuments(),
            activeSubscribers: await Newsletter_1.default.countDocuments({ status: "active" }),
            inactiveSubscribers: await Newsletter_1.default.countDocuments({ status: "inactive" }),
        };
        return res.status(200).json({
            success: true,
            message: "Subscribers fetched successfully.",
            count: subscribers.length,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
            statistics,
            subscribers,
        });
    }
    catch (error) {
        console.error("Error fetching subscribers:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching subscribers.",
        });
    }
};
exports.getAllSubscribers = getAllSubscribers;
// Delete subscriber controller
const deleteSubscriber = async (req, res) => {
    try {
        const requestUser = req.user;
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can delete subscribers.",
            });
        }
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Subscriber ID is required.",
            });
        }
        const subscriber = await Newsletter_1.default.findByIdAndDelete(id);
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Subscriber not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Subscriber deleted successfully.",
        });
    }
    catch (error) {
        console.error("Error deleting subscriber:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting subscriber.",
        });
    }
};
exports.deleteSubscriber = deleteSubscriber;
