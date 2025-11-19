import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import DocsModel from "../../../models/DocsModel";
import MasterWorkflow from "../../../models/MasterWorkflow";

export const addDocs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // Role check
    if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can create docs.",
      });
    }

    const { service_id, docs } = req.body;

    // Validation
    if (!service_id || !docs) {
      return res.status(400).json({
        success: false,
        message: "service_id and docs field are required.",
      });
    }

    // Check workflow exists
    const workflowExists = await MasterWorkflow.findById(service_id);
    if (!workflowExists) {
      return res.status(404).json({
        success: false,
        message: "Invalid service_id. Master Workflow not found.",
      });
    }

    // Save document
    const newDocs = new DocsModel({ service_id, docs });
    const saved = await newDocs.save();

    return res.status(201).json({
      success: true,
      message: "Document created successfully.",
      data: saved,
    });
  } catch (error) {
    console.error("Error adding docs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating document.",
    });
  }
};


export const updateDocs = async (req: AuthenticatedRequest, res: Response) => {
  try {

     const requestUser = req.user;

    // Role check
    if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can create docs.",
      });
    }

    const { docs, id } = req.body;

    if (!docs) {
      return res.status(400).json({
        success: false,
        message: "docs field is required to update.",
      });
    }

    const updated = await DocsModel.findByIdAndUpdate(
      id,
      { docs },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating docs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating document.",
    });
  }
};



export const getDocsByService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { service_id } = req.body;
   

    if (!service_id) {
      return res.status(400).json({
        success: false,
        message: "service_id is required.",
      });
    }

    const docs = await DocsModel.findOne({ service_id }).populate('service_id','name');

    return res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error) {
    console.error("Error fetching docs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching documents.",
    });
  }
};


export const deleteDocs = async (req: AuthenticatedRequest, res: Response) => {
  try {

     const requestUser = req.user;

    // Role check
    if (requestUser?.role !== "admin" && requestUser?.role !== "developer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators and developers can create docs.",
      });
    }
    const { id } = req.body;

    const deleted = await DocsModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting docs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting document.",
    });
  }
};


export const getDocsById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.body;

    const doc = await DocsModel.findById(id).populate('service_id','name');

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    console.error("Error fetching doc by id:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching document.",
    });
  }
};


export const getDocsList = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const docs = await DocsModel.find().select('-docs').populate('service_id','name');

    return res.status(200).json({
      success: true,
      total: docs.length,
      data: docs,
    });
  } catch (error) {
    console.error("Error fetching docs list:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching docs list.",
    });
  }
};
