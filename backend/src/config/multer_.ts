import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = path.join(process.cwd(), "temp_uploads");

// ✅ Ensure temp directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_ = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Unique name with timestamp
    const uniqueName = `temp-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export const  upload_ = multer({
  storage: storage_,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
}).single("image");