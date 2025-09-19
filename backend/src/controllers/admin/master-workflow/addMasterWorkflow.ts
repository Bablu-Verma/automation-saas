import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const addMasterWorkflow = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control
    if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can create master workflows.",
      });
    }

    const {
      name,
      description,
      workflowJsonTemplate,
      serviceIconUrl,
      isPublished, // should be "ACTIVE" | "PAUSE"
      requiredInputs,
      requiredCredentials,
      category,
    } = req.body;

    // ✅ Manual validation
    if (!name || !workflowJsonTemplate) {
      return res.status(400).json({
        success: false,
        message: "Name and workflowJsonTemplate are required fields.",
      });
    }

    // ✅ Check for duplicate name
    const existingWorkflow = await MasterWorkflow.findOne({ name });
    if (existingWorkflow) {
      return res.status(409).json({
        success: false,
        message: "A master workflow with this name already exists.",
      });
    }

    // ✅ Create new workflow
    const newWorkflow = new MasterWorkflow({
      name,
      description,
      workflowJsonTemplate,
      serviceIconUrl,
      isPublished: isPublished ?? "PAUSE", // default string
      requiredInputs: requiredInputs ?? [],
      requiredCredentials: requiredCredentials ?? [],
      category: category ?? "general",
    });

    const savedWorkflow = await newWorkflow.save();

    return res.status(201).json({
      success: true,
      message: "Master workflow created successfully.",
      workflow: savedWorkflow,
    });
  } catch (error) {
    console.error("Error adding master workflow:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating master workflow.",
    });
  }
};

