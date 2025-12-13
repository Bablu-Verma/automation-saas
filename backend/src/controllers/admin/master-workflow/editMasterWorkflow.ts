import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";
import slug from "slug";

export const editMasterWorkflow = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Role check
    if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can edit master workflows.",
      });
    }

    const {
      id,
      name,
      description,
      pricingPlans,
      currency,
      workflowJsonTemplate,
      serviceImage,
      isPublished,
      requiredInputs,
      keyword,
      requiredCredentials,
    } = req.body;



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


   let find_workflow = await MasterWorkflow.findById(id)

   if(!find_workflow){
     return res.status(400).json({
        success: false,
        message: "Work Flow not found",
      });
   }

   // ✅ Build update fields dynamically
    const updateFields: Record<string, any> = {};

   if (name && find_workflow.name !== name) {
      const newSlug = slug(name);

      const existingSlug = await MasterWorkflow.findOne({
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

    
    if (description !== undefined) updateFields.description = description;
    if (workflowJsonTemplate !== undefined) updateFields.workflowJsonTemplate = workflowJsonTemplate;
    if (serviceImage !== undefined) updateFields.serviceImage = serviceImage;
    if (isPublished !== undefined) updateFields.isPublished = isPublished;
    if (pricingPlans !== undefined) updateFields.pricingPlans = pricingPlans;
    if (currency !== undefined) updateFields.currency = currency;
    if (requiredInputs !== undefined) updateFields.requiredInputs = requiredInputs;
    if (requiredCredentials !== undefined) updateFields.requiredCredentials = requiredCredentials;
    if (keyword !== undefined) updateFields.category = keyword;
  

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // ✅ Duplicate name check (ignore current ID)
    if (name) {
      const existing = await MasterWorkflow.findOne({
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
    const updatedWorkflow = await MasterWorkflow.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    console.error("Error updating master workflow:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating master workflow.",
    });
  }
};
