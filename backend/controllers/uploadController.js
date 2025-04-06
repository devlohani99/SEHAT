import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    // Create a safe filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
  }
};

// Upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
});

// Upload controller
export const uploadFile = async (req, res) => {
  try {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred during upload
        return res.status(400).json({
          success: false,
          error: err.message
        });
      } else if (err) {
        // An unknown error occurred
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded"
        });
      }

      // Success response
      res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        file: {
          filename: req.file.filename,
          path: `/uploads/${req.file.filename}`,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while uploading file"
    });
  }
};

// Get all files controller
export const getAllFiles = async (req, res) => {
  try {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to fetch files"
        });
      }
      
      const filePaths = files.map(file => ({
        filename: file,
        path: `/uploads/${file}`
      }));

      res.status(200).json({
        success: true,
        files: filePaths
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching files"
    });
  }
};