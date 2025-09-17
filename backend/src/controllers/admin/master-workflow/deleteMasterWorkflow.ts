import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const deleteMasterWorkflow = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const requestuser = req.user

  if (requestuser?.role !== 'admin' && requestuser?.role !== 'developer') {
    return res.status(403).json({ success: false,  message: 'Access denied. Only administrators and developers can delete master workflows.' });
  }

    const { id } = req.body;

    const deletedWorkflow = await MasterWorkflow.findByIdAndDelete(id);

    if (!deletedWorkflow) {
      return res.status(404).json({ success: false, message: 'Master workflow not found.' });
    }

    res.status(200).json({
      message: 'Master workflow deleted successfully.',
      success: true,
    });
  } catch (error) {
    console.error('Error deleting master workflow:', error);
    res.status(500).json({ message: 'Server error while deleting master workflow.', success: false,});
  }
};