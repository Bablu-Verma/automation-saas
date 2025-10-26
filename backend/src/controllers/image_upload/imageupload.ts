import { Response } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { AuthenticatedRequest } from "../../middlewares/loginCheck";
import { promises as fsp } from "fs";
import axios from "axios";
import FormData from "form-data";

async function uploadToImgBB(filePath: string, apiKey: string): Promise<string> {
    try {
        const form = new FormData();
        form.append("image", fs.createReadStream(filePath));

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            form,
            { 
                headers: form.getHeaders(),
                timeout: 30000
            }
        );

        return response.data.data.url; 
    } catch (error: any) {
        console.error("Upload failed:", error.response?.data || error.message);
        throw error;
    }
}



export const uploadImageByAdmin = async (req: AuthenticatedRequest, res: Response) => {
  let inputPath: string | null = null;
  let tempOutputPath: string | null = null;

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
    const tempOptimizedDir = path.join(process.cwd(), "temp_optimized");
    if (!fs.existsSync(tempOptimizedDir)) {
      fs.mkdirSync(tempOptimizedDir, { recursive: true });
    }

   const originalName = path.parse(req.file.originalname).name;
   tempOutputPath = path.join(tempOptimizedDir, `${originalName}-${Date.now()}.jpg`);
    
    console.log("Creating optimized file at:", tempOutputPath);

    // ✅ Sharp optimization
    await sharp(inputPath)
      .resize({ width: 1600 })
      .jpeg({ quality: 80 })
      .toFile(tempOutputPath);

    console.log("Image optimized successfully");

    // ✅ Upload to ImgBB
    let imgBBUrl: string;
    try {
      console.log("Uploading to ImgBB...");
      imgBBUrl = await uploadToImgBB(tempOutputPath, imgBBApiKey);
      console.log("ImgBB upload successful:", imgBBUrl);
    } catch (uploadError) {
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

  } catch (error) {
    console.error("Error uploading image by admin:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while uploading image.",
    });
  } finally {
    // ✅ Cleanup - dono temporary files delete karo
    const cleanupFiles = [inputPath, tempOutputPath].filter(Boolean);
    
    // console.log("Cleaning up files:", cleanupFiles);
    
    for (const filePath of cleanupFiles) {
      if (filePath && fs.existsSync(filePath)) {
        try {
          await fsp.unlink(filePath);
          // console.log("Successfully deleted:", filePath);
        } catch (err: any) {
          if (err.code !== "ENOENT") {
            console.error("Error deleting file:", err);
          }
        }
      }
    }
  }
};