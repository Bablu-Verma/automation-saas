import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";

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

    const { id } = req.params; // user ID to update
    const { name, email, role, status, profile } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // ✅ Build update object
    const updateFields: Record<string, any> = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (role !== undefined && ["user", "admin", "developer"].includes(role)) updateFields.role = role;
    if (status !== undefined && ["active", "inactive", "banned", "delete_request", "deleted"].includes(status)) updateFields.status = status;
    if (profile !== undefined) updateFields.profile = profile;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    // ✅ Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true, context: "query" }
    ).select("-password -otp"); // hide sensitive fields

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user by admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user.",
    });
  }
};
