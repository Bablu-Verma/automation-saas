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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
async function uploadToImgBB(filePath, apiKey) {
    try {
        const form = new form_data_1.default();
        form.append("image", fs_1.default.createReadStream(filePath));
        const response = await axios_1.default.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
            headers: form.getHeaders(),
            timeout: 30000
        });
        return response.data.data.url;
    }
    catch (error) {
        console.error("Upload failed:", error.response?.data || error.message);
        throw error;
    }
}
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
        const imgBBApiKey = process.env.IMGBB_API_KEY;
        if (!imgBBApiKey) {
            return res.status(500).json({
                success: false,
                message: "ImgBB API key not configured.",
            });
        }
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
        // ✅ Upload to ImgBB
        let imgBBUrl;
        try {
            console.log("Uploading to ImgBB...");
            imgBBUrl = await uploadToImgBB(tempOutputPath, imgBBApiKey);
            console.log("ImgBB upload successful:", imgBBUrl);
        }
        catch (uploadError) {
            console.error("ImgBB upload failed:", uploadError);
            return res.status(500).json({
                success: false,
                message: "Failed to upload image to ImgBB.",
            });
        }
        // ✅ Success response
        return res.status(200).json({
            success: true,
            message: "Image uploaded & optimized successfully.",
            imageUrl: imgBBUrl,
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
        // console.log("Cleaning up files:", cleanupFiles);
        for (const filePath of cleanupFiles) {
            if (filePath && fs_1.default.existsSync(filePath)) {
                try {
                    await fs_2.promises.unlink(filePath);
                    // console.log("Successfully deleted:", filePath);
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
