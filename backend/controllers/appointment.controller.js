// backend/controllers/appointment.controller.js
import Appointment from '../models/appointment.model.js';

// Create a new appointment
export const createAppointment = async (req, res) => {
    try {
      console.log("Received appointment data:", req.body);
      
      // Validate required fields
      if (!req.body.doctor) {
        return res.status(400).json({ message: "Doctor ID is required" });
      }
      
      if (!req.body.appointmentDate) {
        return res.status(400).json({ message: "Appointment date is required" });
      }
      
      // If no user ID is provided, use a default one
      const appointmentData = {
        ...req.body,
        user: req.body.user || "645a3293a95d3aa3e37898b4" // Replace with a valid user ID from your database
      };
      
      const appointment = new Appointment(appointmentData);
      await appointment.save();
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Appointment creation error:", error);
      res.status(400).json({ message: error.message });
    }
  };

// Get all appointments for a user
export const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate('doctor', 'name specialization')
      .populate({
        path: 'doctor',
        populate: {
          path: 'hospital',
          select: 'name address'
        }
      })
      .sort({ appointmentDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments for a doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ 
      doctor: req.params.doctorId,
      status: { $ne: 'cancelled' }
    })
      .populate('user', 'name email')
      .sort({ appointmentDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all appointments (for doctor dashboard without login)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('doctor', 'name specialization')
      .populate({
        path: 'doctor',
        populate: {
          path: 'hospital',
          select: 'name address'
        }
      })
      .sort({ appointmentDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name email')
      .populate('doctor', 'name specialization')
      .populate({
        path: 'doctor',
        populate: {
          path: 'hospital',
          select: 'name address'
        }
      });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('doctor', 'name specialization');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel appointment
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};