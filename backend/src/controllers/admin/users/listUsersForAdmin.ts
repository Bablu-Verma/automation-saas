import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";

export const listUsersForAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view users.",
      });
    }

    // ✅ Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // ✅ Optional search by name/email
    const search = req.query.search ? (req.query.search as string) : "";
    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // ✅ Fetch users
    const users = await User.find(searchFilter)
      .select("name email role status createdAt profile updatedAt") // only needed fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(searchFilter);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      count: users.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users.",
    });
  }
};
