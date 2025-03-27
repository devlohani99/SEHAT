import Doctor from "../models/doctor.model.js";
import Hospital from "../models/hospital.model.js";

// Create a new doctor
export const createDoctor = async (req, res) => {
  try {
    const { name, specialization, hospitalId, availableTimeSlots } = req.body;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    const newDoctor = new Doctor({
      name,
      specialization,
      hospitalId,
      availableTimeSlots,
    });

    await newDoctor.save();
    res.status(201).json({ message: "Doctor created successfully", newDoctor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get doctors by hospitalId
export const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const doctors = await Doctor.find({ hospitalId }).populate("hospitalId");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
