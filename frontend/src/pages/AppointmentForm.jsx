import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppointmentStore } from "../store/appointment.store.js";
import { useAuthStore } from "../store/auth.store.js";

const AppointmentForm = () => {
  const {
    hospitals,
    doctors,
    selectedHospital,
    selectedDoctor,
    selectedTimeSlot,
    fetchHospitals,
    fetchDoctors,
    setSelectedHospital,
    setSelectedDoctor,
    setSelectedTimeSlot,
    loading,
    error,
  } = useAppointmentStore();

  const { user, loading: userLoading } = useAuthStore(); // Access user and loading state

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      const fakeTimeSlots = [
        "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
      ];
      setAvailableTimeSlots(fakeTimeSlots); // Fake time slots for demo
    }
  }, [selectedDoctor]);

  const handleBookAppointment = () => {
    if (!user || !user.name || !user.email) {
      console.error("User is not logged in properly");
      return;
    }

    axios
      .post("http://localhost:5000/api/appointment/book", {
        hospitalId: selectedHospital,
        doctorId: selectedDoctor,
        userName: user.name,
        userEmail: user.email,
        timeSlot: selectedTimeSlot,
      })
      .then((response) => {
        console.log("Appointment booked:", response.data);
        setBookedAppointment(response.data.appointment);
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
      });
  };

  // If user data is still loading, show a loading message
  if (userLoading) {
    return <div>Loading user data...</div>;
  }

  // If user is not logged in, show a message
  if (!user) {
    return <div>Please log in to book an appointment.</div>;
  }

  return (
    <div>
      <h2>Book an Appointment</h2>

      <label>Choose Hospital</label>
      <select
        value={selectedHospital}
        onChange={(e) => {
          setSelectedHospital(e.target.value);
          fetchDoctors(e.target.value);
        }}
      >
        <option value="">Select Hospital</option>
        {hospitals.map((hospital) => (
          <option key={hospital._id} value={hospital._id}>
            {hospital.name}
          </option>
        ))}
      </select>

      <label>Choose Doctor</label>
      <select
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
        disabled={loading || !selectedHospital}
      >
        <option value="">Select Doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>
            {doctor.name} - {doctor.specialization}
          </option>
        ))}
      </select>

      <label>Choose Time Slot</label>
      <select
        value={selectedTimeSlot}
        onChange={(e) => setSelectedTimeSlot(e.target.value)}
        disabled={loading || !selectedDoctor}
      >
        <option value="">Select Time Slot</option>
        {availableTimeSlots.map((time, idx) => (
          <option key={idx} value={time}>
            {time}
          </option>
        ))}
      </select>

      <button onClick={handleBookAppointment} disabled={loading || !selectedTimeSlot}>
        Book Appointment
      </button>

      {error && <p>{error}</p>}

      {bookedAppointment && (
        <div>
          <h3>Appointment Booked Successfully!</h3>
          <p>Hospital: {bookedAppointment.hospitalName}</p>
          <p>Doctor: {bookedAppointment.doctorName}</p>
          <p>Time Slot: {bookedAppointment.timeSlot}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
