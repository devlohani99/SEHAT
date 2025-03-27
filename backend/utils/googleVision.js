import vision from "@google-cloud/vision";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.resolve(process.env.GOOGLE_CLOUD_KEY_PATH),
});

export default client;
