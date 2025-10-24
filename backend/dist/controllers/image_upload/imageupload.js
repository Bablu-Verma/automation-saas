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
const uploadImageByAdmin = async (req, res) => {
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
        const outputPath = path_1.default.join("images", uniqueFileName);
        // ✅ Sharp optimization
        await (0, sharp_1.default)(inputPath)
            .resize({ width: 1600 })
            .jpeg({ quality: 80 })
            .toFile(outputPath);
        // ✅ Delete original file after optimization
        if (fs_1.default.existsSync(inputPath)) {
            try {
                await fs_2.promises.unlink(inputPath);
            }
            catch (err) {
                if (err.code !== "ENOENT") {
                    console.error("Error deleting file:", err);
                }
            }
        }
        // ✅ Public path for client
        const filePath = `/images/${uniqueFileName}`;
        return res.status(200).json({
            success: true,
            message: "Image uploaded & optimized successfully.",
            filePath,
        });
    }
    catch (error) {
        console.error("Error uploading image by admin:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while uploading image.",
        });
    }
};
exports.uploadImageByAdmin = uploadImageByAdmin;
