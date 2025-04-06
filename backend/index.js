import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import aiRoutes from "./routes/ai.route.js";
import nearbyHospital from "./routes/nearby.route.js";
import hospitalRoutes from "./routes/hospital.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import appointmentRoutes from "./routes/appointment.route.js";
import cors from "cors";
import FormData from "form-data";
import axios from "axios";
import multer from "multer";
import counselorRoute from "./routes/counsellor.route.js";
import unsafeRoute from "./routes/unsafe.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/nearby", nearbyHospital);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/counselor", counselorRoute);
app.use("/api/unsafe", unsafeRoute);

app.post("/api/upload-to-pinata", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    const data = new FormData();

    // Add file to form data
    data.append("file", req.file.buffer, {
      filename: `image-${Date.now()}${req.file.originalname}`,
      contentType: req.file.mimetype,
    });

    // Add metadata
    const pinataMetadata = JSON.stringify({
      name: `image-${Date.now()}`,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: req.file.mimetype,
      },
    });
    data.append("pinataMetadata", pinataMetadata);

    // Add options
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    data.append("pinataOptions", pinataOptions);

    // Make request to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...data.getHeaders(),
        },
        maxBodyLength: "Infinity", // Required for large files
      }
    );

    res.json({
      success: true,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || "Error uploading file to Pinata",
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something broke!",
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
