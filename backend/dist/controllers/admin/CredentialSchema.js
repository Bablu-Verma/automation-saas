"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialSchema = void 0;
const _n8n_helper_1 = require("../../lib/_n8n_helper");
const CredentialSchema = async (req, res) => {
    try {
        const requestUser = req.user;
        if (!requestUser || requestUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators can access.",
            });
        }
        const { credentialType, } = req.body;
        const schemaData = await (0, _n8n_helper_1.getCredentialSchema)(credentialType);
        return res.status(200).json({
            success: true,
            message: "schema fetched successfully.",
            schemaData
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
exports.CredentialSchema = CredentialSchema;
