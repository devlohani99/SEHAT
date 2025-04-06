import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppointmentStore from '../../store/appointmentStore';
import { useAuthStore } from '../../store/auth.store';
import {
    BuildingOffice2Icon,
    UserIcon,
    CalendarIcon,
    ClockIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const AppointmentConfirmation = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const { user } = useAuthStore();
    const { 
        selectedHospital, 
        selectedDoctor, 
        selectedDate,
        createAppointment,
        resetSelections,
        loading 
    } = useAppointmentStore();

    const handleConfirm = async () => {
        try {
            const userId = user?._id || "645a3293a95d3aa3e37898b4";
            
            const appointmentData = {
                user: userId,
                doctor: selectedDoctor._id,
                appointmentDate: selectedDate,
                status: 'scheduled'
            };
            
            await createAppointment(appointmentData);
            resetSelections();
            navigate('/my-appointments');
        } catch (error) {
            console.error('Appointment creation error:', error);
            setError(error.response?.data?.message || 'Failed to create appointment');
        }
    };

    const handleCancel = () => {
        resetSelections();
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="text-gray-600 font-medium">Creating your appointment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Confirm Your Appointment</h2>
                <p className="mt-2 text-gray-600">Please review your appointment details below</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                        <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
                        <p className="text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Appointment Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Hospital Details */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <BuildingOffice2Icon className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Hospital</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{selectedHospital.name}</p>
                            <p className="mt-1 text-sm text-gray-600">{selectedHospital.address}</p>
                        </div>
                    </div>
                </div>

                {/* Doctor Details */}
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <UserIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">Dr. {selectedDoctor.name}</p>
                            <p className="mt-1 text-sm text-green-600 font-medium">{selectedDoctor.specialization}</p>
                        </div>
                    </div>
                </div>

                {/* Date and Time */}
                <div className="p-6">
                    <div className="flex items-start space-x-6">
                        <div className="flex items-start">
                            <CalendarIcon className="h-6 w-6 text-green-500" />
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <ClockIcon className="h-6 w-6 text-green-500" />
                            <div className="ml-4">
                                <h3 className="text-sm font-medium text-gray-500">Time</h3>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    {selectedDate.toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={handleCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
                >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Confirm Appointment
                </button>
            </div>
        </div>
    );
};

export default AppointmentConfirmation;