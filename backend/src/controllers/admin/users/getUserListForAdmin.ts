import { Response } from "express";
import { AuthenticatedRequest } from "../../../middlewares/loginCheck";
import User from "../../../models/User";

export const getUserListForAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control: only admin
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can view user list.",
      });
    }

    // ✅ Get all parameters from request body
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      role = ""
    } = req.body;

    // ✅ Pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // ✅ Build filter object
    const filter: any = {};

    // Search filter (name, email, or company)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "profile.company": { $regex: search, $options: "i" } }
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Role filter
    if (role) {
      filter.role = role;
    }

    // ✅ Fetch users with pagination and filters
    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select("-password -otp") // exclude sensitive fields
        .sort({ createdAt: -1 }) // latest first
        .skip(skip)
        .limit(limitNum)
        .lean(),
      
      User.countDocuments(filter)
    ]);

    // ✅ Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      success: true,
      message: "User list fetched successfully.",
      users,
      total: totalUsers,
      page: pageNum,
      totalPages,
      hasNextPage,
      hasPrevPage,
      limit: limitNum
    });

  } catch (error) {
    console.error("Error fetching user list for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user list.",
    });
  }
};