import { Request, Response } from "express";
import ContactUs from "../../models/ContactUs";
import { AuthenticatedRequest } from "../../middlewares/loginCheck";



export const getContacts = async (req: AuthenticatedRequest, res: Response) => {

  try {

     const requestUser = req.user;

    
   if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view user details.",
      });
    }
    const { page = 1, limit = 10, search = "", status } = req.body;
    const skip = (page - 1) * limit;

    // Build filter
    let filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    // Query DB
    const contacts = await ContactUs.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ContactUs.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Contacts fetched successfully.",
      count: contacts.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching contacts.",
    });
  }
};


// Update contact status (POST /contacts/status/:id)
export const updateContactStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can update contact status.",
      });
    }

    const { status , id} = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required.",
      });
    }

    if (!["UN_READ", "READ"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const contact = await ContactUs.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating status.",
    });
  }
};



// Alternative: Delete a contact using POST with ID in body (POST /contacts/delete)
export const deleteContactus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can delete contacts.",
      });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required.",
      });
    }

    const contact = await ContactUs.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting contact.",
    });
  }
};