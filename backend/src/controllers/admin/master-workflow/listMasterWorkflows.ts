import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const listMasterWorkflows = async (req: AuthenticatedRequest, res: Response) => {
  try {
  
     const requestuser = req.user

  if (requestuser?.role !== 'admin' && requestuser?.role !== 'developer') {
    return res.status(403).json({ success: false,  message: 'Access denied. Only administrators and developers can delete master workflows.' });
  }

    
  const workflows = await MasterWorkflow.find().sort({ name: 1 });
    res.status(200).json({
      message: 'Master workflows fetched successfully.',
      count: workflows.length,
      workflows,
    });
  } catch (error) {
    console.error('Error listing master workflows:', error);
    res.status(500).json({ message: 'Server error while fetching master workflows.', success: false, });
  }
};