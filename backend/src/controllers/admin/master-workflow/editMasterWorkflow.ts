import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const editMasterWorkflow = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestuser = req.user;

    if (requestuser?.role !== 'admin' && requestuser?.role !== 'developer') {
      return res.status(403).json({ success: false, message: 'Access denied. Only administrators and developers can edit master workflows.' });
    }

    const { id, name, description, workflowJsonTemplate, serviceIconUrl, isPublished } = req.body;

    // Validate that a document ID is provided
    if (!id) {
        return res.status(400).json({ success: false, message: 'Master workflow ID is required for editing.' });
    }

    // Create an object with only the fields that are allowed to be updated.
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (workflowJsonTemplate !== undefined) updateFields.workflowJsonTemplate = workflowJsonTemplate;
    if (serviceIconUrl !== undefined) updateFields.serviceIconUrl = serviceIconUrl;
    if (isPublished !== undefined) updateFields.isPublished = isPublished;

    // Check if there are any fields to update
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ success: false, message: 'No valid fields provided for update.' });
    }

    const updatedWorkflow = await MasterWorkflow.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedWorkflow) {
      return res.status(404).json({ success: false, message: 'Master workflow not found.' });
    }

    res.status(200).json({
      message: 'Master workflow updated successfully.',
      workflow: updatedWorkflow,
      success: true,
    });
  } catch (error) {
    console.error('Error updating master workflow:', error);
    res.status(500).json({ message: 'Server error while updating master workflow.', success: false });
  }
};
