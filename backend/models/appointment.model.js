import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
