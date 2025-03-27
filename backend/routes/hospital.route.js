import express from "express";
import { createHospital, getAllHospitals } from "../controllers/hospital.controller.js";

const router = express.Router();

router.post("/create", createHospital);
router.get("/", getAllHospitals);

export default router;
