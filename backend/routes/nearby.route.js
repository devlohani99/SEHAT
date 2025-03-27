import express from "express";
import {getNearbyHospitals } from "../controllers/nearby.controller.js";

const router = express.Router();

router.get("/find", getNearbyHospitals);

export default router;
