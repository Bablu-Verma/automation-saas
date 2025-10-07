import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";
import mongoose from "mongoose";

export const updateUserByAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can update users.",
      });
    }

    const { name, email, role, status, profile, id } = req.body;

    // ✅ Validate user ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required.",
      });
    }

    // ✅ Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // ✅ Build update object with validation
    const updateFields: Record<string, any> = {};
    
    // Name update
    if (name !== undefined) {
      if (name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty.",
        });
      }
      updateFields.name = name.trim();
    }

    // Email update with validation
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address.",
        });
      }
      
      // Check if email already exists (excluding current user)
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: id } 
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists.",
        });
      }
      updateFields.email = email.toLowerCase();
    }

    // Role update with validation
    if (role !== undefined) {
      const validRoles = ["user", "admin", "developer"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be one of: user, admin, developer.",
        });
      }
      updateFields.role = role;
    }

    // Status update with validation
    if (status !== undefined) {
      const validStatuses = ["active", "inactive", "banned", "delete_request", "deleted"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be one of: active, inactive, banned, delete_request, deleted.",
        });
      }
      updateFields.status = status;
    }

    // Profile update
    if (profile !== undefined) {
      updateFields.profile = { ...existingUser.profile, ...profile };
    }

    // ✅ Check if any valid fields provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        $set: updateFields,
        $currentDate: { updatedAt: true } // Auto update timestamp
      },
      { 
        new: true, 
        runValidators: true, 
        context: "query" 
      }
    ).select("-password -otp"); // hide sensitive fields

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
      updatedFields: Object.keys(updateFields) // Return which fields were updated
    });

  } catch (error: any) {
    console.error("Error updating user by admin:", error);
    
    // ✅ Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while updating user.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

