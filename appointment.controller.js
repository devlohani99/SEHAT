// backend/controllers/appointment.controller.js
import Appointment from '../models/appointment.model.js';
import { google } from 'googleapis';

// Configure Google Calendar API
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_CLOUD_KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  }),
});

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

// Start video call
export const startVideoCall = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ message: 'Appointment must be scheduled to start a video call' });
    }

    // Create a Google Meet event
    const event = {
      summary: `Medical Consultation - Dr. ${appointment.doctor.name}`,
      description: `Video consultation for appointment`,
      start: {
        dateTime: new Date(appointment.appointmentDate).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(new Date(appointment.appointmentDate).getTime() + 30 * 60000).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: appointment._id.toString(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const createdEvent = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      conferenceDataVersion: 1,
      resource: event,
    });

    // Update appointment with video call details
    appointment.meetLink = createdEvent.data.hangoutLink;
    appointment.callStatus = 'in_progress';
    appointment.callStartTime = new Date();
    await appointment.save();

    res.status(200).json({
      meetLink: appointment.meetLink,
      message: 'Video call started successfully',
    });
  } catch (error) {
    console.error('Error starting video call:', error);
    res.status(500).json({ message: error.message });
  }
};

// End video call
export const endVideoCall = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.callStatus !== 'in_progress') {
      return res.status(400).json({ message: 'No active video call found' });
    }

    // Update appointment status
    appointment.callStatus = 'ended';
    appointment.callEndTime = new Date();
    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({
      message: 'Video call ended successfully',
    });
  } catch (error) {
    console.error('Error ending video call:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get video call status
export const getVideoCallStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      callStatus: appointment.callStatus,
      meetLink: appointment.meetLink,
      callStartTime: appointment.callStartTime,
      callEndTime: appointment.callEndTime,
    });
  } catch (error) {
    console.error('Error getting video call status:', error);
    res.status(500).json({ message: error.message });
  }
};
