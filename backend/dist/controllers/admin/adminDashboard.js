"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboard = void 0;
const User_1 = __importDefault(require("../../models/User"));
const AutomationInstance_1 = __importDefault(require("../../models/AutomationInstance"));
const Payment_1 = __importDefault(require("../../models/Payment"));
const ContactUs_1 = __importDefault(require("../../models/ContactUs"));
const MasterWorkflow_1 = __importDefault(require("../../models/MasterWorkflow"));
const getAdminDashboard = async (req, res) => {
    try {
        const user = req.user;
        // Ensure user is an admin
        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Access denied", success: false });
        }
        // 🧩 Fetch total counts in parallel
        const [totalUsers, totalAutomations, totalPayments, totalContacts, totalWorkflows,] = await Promise.all([
            User_1.default.countDocuments(),
            AutomationInstance_1.default.countDocuments(),
            Payment_1.default.countDocuments(),
            ContactUs_1.default.countDocuments(),
            MasterWorkflow_1.default.countDocuments(),
        ]);
        // 🕓 Fetch latest records
        const [latestUsers, latestPayments, latestContacts, latestAutomations,] = await Promise.all([
            User_1.default.find().sort({ createdAt: -1 }).limit(5).select("name email role status createdAt"),
            Payment_1.default.find()
                .populate("user", "name email")
                .populate("instanceId", "instanceName")
                .sort({ createdAt: -1 })
                .limit(5),
            ContactUs_1.default.find().sort({ createdAt: -1 }).limit(5).select("name email subject status createdAt"),
            AutomationInstance_1.default.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .select("instanceName user systemStatus n8nWorkflowId createdAt"),
        ]);
        // 📊 Combine response data
        return res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully",
            data: {
                counts: {
                    users: totalUsers,
                    automations: totalAutomations,
                    payments: totalPayments,
                    contacts: totalContacts,
                    workflows: totalWorkflows,
                },
                latest: {
                    users: latestUsers,
                    payments: latestPayments,
                    contacts: latestContacts,
                    automations: latestAutomations,
                },
            },
        });
    }
    catch (err) {
        console.error("Error fetching admin dashboard:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching admin dashboard",
        });
    }
};
exports.getAdminDashboard = getAdminDashboard;
