import express from "express";
import { createDoctor, getDoctorsByHospital } from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/create", createDoctor);
router.get("/hospital/:hospitalId", getDoctorsByHospital);

export default router;
