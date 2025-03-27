import client from "../utils/googleVision.js";
import fs from "fs";

export const scanPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const [result] = await client.textDetection(req.file.path);
    let extractedText = result.fullTextAnnotation
      ? result.fullTextAnnotation.text
      : "No text detected";

    extractedText = extractedText.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Prescription Scanned Successfully",
      data: extractedText,
    });

  } catch (error) {
    console.error("OCR Error:", error);
    return res.status(500).json({ success: false, message: "Error processing prescription" });
  }
};
