"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = void 0;
const AutomationInstance_1 = __importDefault(require("../../../models/AutomationInstance"));
const Payment_1 = __importDefault(require("../../../models/Payment"));
const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized", success: false });
        }
        // 🔹 Fetch latest 4 automations
        const latestAutomations = await AutomationInstance_1.default.find({ user: userId })
            .select("-userInputs -n8nCredential")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(4);
        // 🔹 Fetch latest 4 payments
        const latestPayments = await Payment_1.default.find({ user: userId })
            .populate("user", "name email profile")
            .populate("instanceId", "instanceName status")
            .sort({ createdAt: -1 })
            .limit(4);
        // 🔹 Return combined dashboard data
        return res.status(200).json({
            message: "User dashboard fetched successfully",
            success: true,
            data: {
                latestAutomations,
                latestPayments,
            },
        });
    }
    catch (err) {
        console.error("Error fetching user dashboard:", err);
        return res.status(500).json({
            message: "Server error while fetching dashboard.",
            success: false,
        });
    }
};
exports.getUserDashboard = getUserDashboard;
