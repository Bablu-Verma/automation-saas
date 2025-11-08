"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMasterWorkflow = void 0;
const MasterWorkflow_1 = __importDefault(require("../../../models/MasterWorkflow"));
const slug_1 = __importDefault(require("slug"));
const editMasterWorkflow = async (req, res) => {
    try {
        const requestUser = req.user;
        // ✅ Role check
        if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only administrators and developers can edit master workflows.",
            });
        }
        const { id, name, description, pricePerMonth, currency, workflowJsonTemplate, trialDays, serviceImage, isPublished, requiredInputs, keyword, requiredCredentials, } = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Master workflow ID is required for editing.",
            });
        }
        // ✅ Validate isPublished
        if (isPublished && !["ACTIVE", "PAUSE"].includes(isPublished)) {
            return res.status(400).json({
                success: false,
                message: "Invalid value for isPublished. Allowed values: ACTIVE, PAUSE.",
            });
        }
        let find_workflow = await MasterWorkflow_1.default.findById(id);
        if (!find_workflow) {
            return res.status(400).json({
                success: false,
                message: "Work Flow not found",
            });
        }
        // ✅ Build update fields dynamically
        const updateFields = {};
        if (name && find_workflow.name !== name) {
            const newSlug = (0, slug_1.default)(name);
            const existingSlug = await MasterWorkflow_1.default.findOne({
                slug: newSlug,
                _id: { $ne: id },
            });
            if (existingSlug) {
                return res.status(409).json({
                    success: false,
                    message: "Slug already exists for another workflow. Please choose a different name.",
                });
            }
            updateFields.slug = newSlug;
            updateFields.name = name;
        }
        if (description !== undefined)
            updateFields.description = description;
        if (workflowJsonTemplate !== undefined)
            updateFields.workflowJsonTemplate = workflowJsonTemplate;
        if (serviceImage !== undefined)
            updateFields.serviceImage = serviceImage;
        if (isPublished !== undefined)
            updateFields.isPublished = isPublished;
        if (pricePerMonth !== undefined)
            updateFields.pricePerMonth = pricePerMonth;
        if (currency !== undefined)
            updateFields.currency = currency;
        if (trialDays !== undefined)
            updateFields.trialDays = trialDays;
        if (requiredInputs !== undefined)
            updateFields.requiredInputs = requiredInputs;
        if (requiredCredentials !== undefined)
            updateFields.requiredCredentials = requiredCredentials;
        if (keyword !== undefined)
            updateFields.category = keyword;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update.",
            });
        }
        // ✅ Duplicate name check (ignore current ID)
        if (name) {
            const existing = await MasterWorkflow_1.default.findOne({
                name,
                _id: { $ne: id },
            });
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: "Another workflow with this name already exists.",
                });
            }
        }
        // ✅ Update workflow
        const updatedWorkflow = await MasterWorkflow_1.default.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: true });
        if (!updatedWorkflow) {
            return res.status(404).json({
                success: false,
                message: "Master workflow not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Master workflow updated successfully.",
            workflow: updatedWorkflow,
        });
    }
    catch (error) {
        console.error("Error updating master workflow:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating master workflow.",
        });
    }
};
exports.editMasterWorkflow = editMasterWorkflow;
