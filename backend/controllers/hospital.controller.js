import Hospital from "../models/hospital.model.js";

// Create a new hospital
export const createHospital = async (req, res) => {
  try {
    const { name, address, contact } = req.body;

    const newHospital = new Hospital({
      name,
      address,
      contact,
    });

    await newHospital.save();
    res.status(201).json({ message: "Hospital created successfully", newHospital });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
