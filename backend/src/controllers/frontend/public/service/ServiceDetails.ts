import { Response } from "express";
import { AuthenticatedRequest } from "../../../../middlewares/loginCheck";
import MasterWorkflow from "../../../../models/MasterWorkflow";


export const getServiceDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Workflow ID is required.",
      });
    }

 
    const workflow = await MasterWorkflow.findOne({_id:id, isPublished: "ACTIVE"} );

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: "Master workflow not found.",
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
