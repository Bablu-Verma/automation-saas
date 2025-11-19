"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageByAdmin = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fs_2 = require("fs");
const cloudinary_1 = require("../../config/cloudinary");
const uploadImageByAdmin = async (req, res) => {
    let inputPath = null;
    let tempOutputPath = null;
    try {
        const requestUser = req.user;
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
        // 📌 Multer saved temporary file
        inputPath = req.file.path;
        console.log("Temporary file saved at:", inputPath);
        // ✅ Temporary optimized file create karo
        const tempOptimizedDir = path_1.default.join(process.cwd(), "temp_optimized");
        if (!fs_1.default.existsSync(tempOptimizedDir)) {
            fs_1.default.mkdirSync(tempOptimizedDir, { recursive: true });
        }
        const originalName = path_1.default.parse(req.file.originalname).name;
        tempOutputPath = path_1.default.join(tempOptimizedDir, `${originalName}-${Date.now()}.jpg`);
        console.log("Creating optimized file at:", tempOutputPath);
        // ✅ Sharp optimization
        await (0, sharp_1.default)(inputPath)
            .resize({ width: 1600 })
            .jpeg({ quality: 80 })
            .toFile(tempOutputPath);
        console.log("Image optimized successfully");
        // ✅ Upload to Cloudinary
        const cloudinary = await (0, cloudinary_1.cloudinary_config)();
        let uploadResult;
        try {
            console.log("Uploading to Cloudinary...");
            const uniqueName = `${originalName}-${Date.now()}`;
            uploadResult = await cloudinary.uploader.upload(tempOutputPath, {
                folder: "service",
                public_id: uniqueName,
                use_filename: false,
            });
            console.log("Cloudinary upload successful:", uploadResult.secure_url);
        }
        catch (uploadError) {
            console.error("Cloudinary upload failed:", uploadError);
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to Cloudinary.",
            });
        }
        // ✅ Success response
        return res.status(200).json({
            success: true,
            message: "Image uploaded & optimized successfully.",
            imageUrl: uploadResult.secure_url,
        });
    }
    catch (error) {
        console.error("Error uploading image by admin:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while uploading image.",
        });
    }
    finally {
        // ✅ Cleanup - dono temporary files delete karo
        const cleanupFiles = [inputPath, tempOutputPath].filter(Boolean);
        for (const filePath of cleanupFiles) {
            if (filePath && fs_1.default.existsSync(filePath)) {
                try {
                    await fs_2.promises.unlink(filePath);
                }
                catch (err) {
                    if (err.code !== "ENOENT") {
                        console.error("Error deleting file:", err);
                    }
                }
            }
        }
    }
};
exports.uploadImageByAdmin = uploadImageByAdmin;
