import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure "images" folder exists
const uploadDir = path.join(process.cwd(), "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage config

const storage_ = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


export const upload_ = multer({ storage:storage_ }).single("image");