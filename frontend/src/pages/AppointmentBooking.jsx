// frontend/src/pages/AppointmentBooking.jsx
import React, { useEffect } from 'react';
import useAppointmentStore from '../store/appointmentStore';
import HospitalSelection from '../components/appointment/HospitalSelection';
import DoctorSelection from '../components/appointment/DoctorSelection';
import TimeSlotSelection from '../components/appointment/TimeSlotSelection';
import AppointmentConfirmation from '../components/appointment/AppointmentConfirmation';

const AppointmentBooking = () => {
    const {
        fetchHospitals,
        selectedHospital,
        selectedDoctor,
        selectedDate,
        loading,
        error
    } = useAppointmentStore();

    useEffect(() => {
        fetchHospitals();
    }, [fetchHospitals]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Book an Appointment</h1>

            <div className="max-w-2xl mx-auto space-y-8">
                {!selectedHospital && <HospitalSelection />}
                {selectedHospital && !selectedDoctor && <DoctorSelection />}
                {selectedDoctor && !selectedDate && <TimeSlotSelection />}
                {selectedDate && <AppointmentConfirmation />}
            </div>
        </div>
    );
};

export default AppointmentBooking;