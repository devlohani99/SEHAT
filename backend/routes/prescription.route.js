import express from "express"
import {scanPrescription} from "../controllers/prescription.controller.js"
import upload from "../utils/multer.js";

const router=express.Router()

router.post("/scan", upload.single("image"), scanPrescription);

export default router
