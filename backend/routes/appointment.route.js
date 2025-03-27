import express from "express";
import { bookAppointment, getAppointmentsByHospital } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/hospital/:hospitalId", getAppointmentsByHospital);

export default router;
