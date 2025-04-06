// backend/routes/appointment.route.js
import express from "express";
import {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments
} from "../controllers/appointment.controller.js";

const router = express.Router();

// Get all appointments (for doctor dashboard without login)
router.get("/", getAllAppointments);

// Create a new appointment
router.post("/", createAppointment);

// Get user's appointments
router.get("/user/:userId", getUserAppointments);

// Get doctor's appointments
router.get("/doctor/:doctorId", getDoctorAppointments);

// Get appointment by ID
router.get("/:id", getAppointmentById);

// Update appointment status
router.put("/:id/status", updateAppointmentStatus);

// Cancel appointment
router.put("/:id/cancel", cancelAppointment);

export default router;