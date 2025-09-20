import { Response } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { AuthenticatedRequest } from "../../middlewares/loginCheck";

export const uploadImageByAdmin = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestUser = req.user;

    // ✅ Access control
    if (!requestUser || requestUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can upload images.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded.",
      });
    }

    // 📌 Multer saved original file
    const inputPath = req.file.path;

    // 📌 Optimized filename (Date.now() + originalname)
    const uniqueFileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const outputPath = path.join("images", uniqueFileName);

    // ✅ Sharp optimization
    await sharp(inputPath)
      .resize({ width: 1600 }) 
      .jpeg({ quality: 80 })   
      .toFile(outputPath);

    // ✅ Delete original file after optimization
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // ✅ Public path for client
    const filePath = `/images/${uniqueFileName}`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded & optimized successfully.",
      filePath,
    });
  } catch (error) {
    console.error("Error uploading image by admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading image.",
    });
  }
};
