"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMasterWorkflow = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../models/MasterWorkflow"));
const slug_1 = __importDefault(require("slug"));
const addMasterWorkflow = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Access control
        if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators and developers can create master workflows.",
            });
        }
        const { name, description, pricePerMonth, currency, workflowJsonTemplate, trialDays, serviceImage, isPublished, keyword, requiredInputs, requiredCredentials, } = req.body;
        // ✅ Manual validation
        if (!name || !workflowJsonTemplate) {
            return res.status(400).json({
                success: false,
                message: "Name and workflowJsonTemplate are required fields.",
            });
        }
        // 🔹 Generate slug from name
        let create_slug = (0, slug_1.default)(name);
        // ✅ Check for duplicate name
        const existingWorkflow = await MasterWorkflow_1.default.findOne({ name });
        if (existingWorkflow) {
            return res.status(409).json({
                success: false,
                message: "A master workflow with this name already exists.",
            });
        }
        // ✅ Check for duplicate slug
        const existingSlug = await MasterWorkflow_1.default.findOne({ slug: create_slug });
        if (existingSlug) {
            return res.status(409).json({
                success: false,
                message: "Slug already exists for another workflow. Please choose a different name.",
            });
        }
        // ✅ Create new workflow
        const newWorkflow = new MasterWorkflow_1.default({
            name,
            slug: create_slug,
            description,
            workflowJsonTemplate,
            serviceImage,
            keyword,
            pricePerMonth,
            currency,
            trialDays,
            isPublished: isPublished ?? "PAUSE", // default string
            requiredInputs: requiredInputs ?? [],
            requiredCredentials: requiredCredentials ?? [],
        });
        const savedWorkflow = await newWorkflow.save();
        return res.status(201).json({
            success: true,
            message: "Master workflow created successfully.",
            workflow: savedWorkflow,
        });
    }
    catch (error) {
        console.error("Error adding master workflow:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating master workflow.",
        });
    }
};
exports.addMasterWorkflow = addMasterWorkflow;
