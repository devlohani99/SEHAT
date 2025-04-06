import { useState, useEffect } from 'react';
import { VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useVideoCallStore from '../../store/videoCallStore';

const VideoCall = ({ appointmentId, onClose }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const { videoCall, loading, error, getVideoCall, updateVideoCallStatus } = useVideoCallStore();

  useEffect(() => {
    fetchVideoCall();
  }, [appointmentId]);

  const fetchVideoCall = async () => {
    try {
      await getVideoCall(appointmentId);
      if (videoCall?.callStatus === 'in_progress') {
        setIsCallActive(true);
      }
    } catch (error) {
      console.error('Error fetching video call:', error);
    }
  };

  const handleStartCall = async () => {
    try {
      await updateVideoCallStatus(appointmentId, 'in_progress');
      setIsCallActive(true);
      window.open(videoCall.meetLink, '_blank');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleEndCall = async () => {
    try {
      await updateVideoCallStatus(appointmentId, 'ended');
      setIsCallActive(false);
      onClose();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-center text-gray-600">Loading video call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="text-red-500 text-center">
            <p className="font-semibold">Error</p>
            <p className="mt-2">{error}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Video Consultation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full inline-block mb-4">
            <VideoCameraIcon className="h-12 w-12 text-blue-500" />
          </div>
          <p className="text-gray-600">
            {isCallActive
              ? 'Video call is in progress'
              : 'Ready to start video consultation'}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {!isCallActive ? (
            <button
              onClick={handleStartCall}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start Call
            </button>
          ) : (
            <button
              onClick={handleEndCall}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall; 
