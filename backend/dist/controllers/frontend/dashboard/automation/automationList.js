"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationList = void 0;
const AutomationInstance_1 = __importDefault(require("../../../../models/AutomationInstance"));
const automationList = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        // 🔹 Pagination params (default: page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // 🔹 Total count (for frontend pagination UI)
        const total = await AutomationInstance_1.default.countDocuments({ user: userId });
        // 🔹 Get paginated data
        const automations = await AutomationInstance_1.default.find({ user: userId })
            .select("-userInputs -n8nCredential")
            .populate("user", "name email")
            .populate("masterWorkflow", "name slug")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(200).json({
            message: "User automation list fetched successfully",
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            automations,
        });
    }
    catch (err) {
        console.error("Error fetching automation list:", err);
        return res.status(500).json({
            message: "Server error while fetching automation list.",
            success: false,
        });
    }
};
exports.automationList = automationList;
