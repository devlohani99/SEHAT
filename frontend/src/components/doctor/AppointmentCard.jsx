// frontend/src/components/doctor/AppointmentCard.jsx
import React from 'react';
import useDoctorStore from '../../store/doctorStore';

const AppointmentCard = ({ appointment }) => {
  const { updateAppointmentStatus } = useDoctorStore();

  const handleStatusUpdate = async (status) => {
    try {
      await updateAppointmentStatus(appointment._id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{appointment.user.name}</h3>
        <p className="text-gray-600">{appointment.user.email}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">Appointment Time</p>
        <p className="font-medium">
          {new Date(appointment.appointmentDate).toLocaleString()}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500">Status</p>
        <span
          className={`inline-block px-2 py-1 rounded-full text-sm ${
            appointment.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : appointment.status === 'cancelled'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {appointment.status}
        </span>
      </div>

      {appointment.status === 'scheduled' && (
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate('completed')}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Complete
          </button>
          <button
            onClick={() => handleStatusUpdate('cancelled')}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;