import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const getMasterWorkflowDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can edit master workflows.",
      });
    }



    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Workflow ID is required.",
      });
    }

    // 🔍 Fetch workflow
    const workflow = await MasterWorkflow.findById(id);

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: "Master workflow not found.",
      });
    }

    if (
      requestUser?.role !== "admin" &&
      requestUser?.role !== "developer" 
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This workflow is not published.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Master workflow fetched successfully.",
      workflow,
    });
  } catch (error) {
    console.error("Error fetching workflow detail:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching workflow detail.",
    });
  }
};
