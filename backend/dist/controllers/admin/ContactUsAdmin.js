"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactus = exports.updateContactStatus = exports.getContacts = void 0;
const ContactUs_1 = __importDefault(require("../../models/ContactUs"));
const getContacts = async (req, res) => {
    try {
        const requestUser = req.user;
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can view user details.",
            });
        }
        const { page = 1, limit = 10, search = "", status, fromDate, toDate, } = req.body;
        const skip = (page - 1) * limit;
        // Build filter
        let filter = {};
        // Search filter
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { message: { $regex: search, $options: "i" } },
                { number: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ];
        }
        // Status filter
        if (status) {
            filter.status = status;
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
        // Query DB
        const contacts = await ContactUs_1.default.find(filter)
            .skip(skip)
            .limit(limit);
        const total = await ContactUs_1.default.countDocuments(filter);
        let dateSummary = null;
        if (fromDate || toDate) {
            const dateFilter = { ...filter };
            if (dateFilter.createdAt) {
                dateSummary = {
                    from: fromDate ? new Date(fromDate).toISOString().split('T')[0] : null,
                    to: toDate ? new Date(toDate).toISOString().split('T')[0] : null
                };
            }
        }
        return res.status(200).json({
            success: true,
            message: "Contacts fetched successfully.",
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
            contacts,
        });
    }
    catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching contacts.",
        });
    }
};
exports.getContacts = getContacts;
// Update contact status (POST /contacts/status/:id)
const updateContactStatus = async (req, res) => {
    try {
        const requestUser = req.user;
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can update contact status.",
            });
        }
        const { status, id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Contact ID is required.",
            });
        }
        if (!["UN_READ", "READ"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value.",
            });
        }
        const contact = await ContactUs_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Status updated successfully.",
            data: contact,
        });
    }
    catch (error) {
        console.error("Error updating contact status:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating status.",
        });
    }
};
exports.updateContactStatus = updateContactStatus;
// Alternative: Delete a contact using POST with ID in body (POST /contacts/delete)
const deleteContactus = async (req, res) => {
    try {
        const requestUser = req.user;
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can delete contacts.",
            });
        }
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Contact ID is required.",
            });
        }
        const contact = await ContactUs_1.default.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Contact deleted successfully.",
        });
    }
    catch (error) {
        console.error("Error deleting contact:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting contact.",
        });
    }
};
exports.deleteContactus = deleteContactus;
