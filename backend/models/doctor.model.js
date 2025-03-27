import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  availableTimeSlots: {
    type: [String], // Array of time slots for simplicity (can be expanded to a more complex structure)
    required: true,
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
