import Appointment from "../models/appointment.model.js";

// Book an appointment
export const bookAppointment = async (req, res) => {
  try {
    const { hospitalId, doctorId, userName, userEmail, timeSlot } = req.body;

    const appointment = new Appointment({
      hospitalId,
      doctorId,
      userName,
      userEmail,
      timeSlot,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get appointments by hospitalId
export const getAppointmentsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const appointments = await Appointment.find({ hospitalId })
      .populate("doctorId")
      .populate("hospitalId");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
