// frontend/src/components/doctor/AppointmentCard.jsx
import { useState } from 'react';
import { useDoctorStore } from '../../store/doctorStore';
import { useVideoCallStore } from '../../store/videoCallStore';
import VideoCall from '../video/VideoCall';
import { VideoCameraIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AppointmentCard = ({ appointment }) => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const { updateAppointmentStatus } = useDoctorStore();
  const { createVideoCall } = useVideoCallStore();

  const handleStatusUpdate = async (status) => {
    try {
      await updateAppointmentStatus(appointment._id, status);
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleStartVideoCall = async () => {
    try {
      await createVideoCall(appointment._id, new Date());
      setShowVideoCall(true);
    } catch (error) {
      console.error('Error starting video call:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{appointment.user.name}</h3>
          <p className="text-gray-600">
            {new Date(appointment.appointmentDate).toLocaleString()}
          </p>
          <p className="text-gray-600">Status: {appointment.status}</p>
        </div>
        <div className="flex space-x-2">
          {appointment.status === 'scheduled' && (
            <button
              onClick={handleStartVideoCall}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              title="Start Video Call"
            >
              <VideoCameraIcon className="h-5 w-5" />
            </button>
          )}
          {appointment.status === 'scheduled' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
              title="Complete Appointment"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
          )}
          {appointment.status === 'scheduled' && (
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              title="Cancel Appointment"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {showVideoCall && (
        <VideoCall
          appointmentId={appointment._id}
          onClose={() => setShowVideoCall(false)}
        />
      )}
    </div>
  );
};

export default AppointmentCard;
