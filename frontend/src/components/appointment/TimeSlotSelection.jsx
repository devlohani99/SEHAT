import React, { useState } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import { ClockIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const TimeSlotSelection = () => {
    const { selectedDoctor, setSelectedDate } = useAppointmentStore();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDay, setSelectedDay] = useState(new Date());

    // Generate next 7 days
    const nextDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    // Morning slots (9 AM to 12 PM)
    const morningSlots = Array.from({ length: 7 }, (_, i) => {
        const hour = i + 9;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    // Afternoon slots (2 PM to 5 PM)
    const afternoonSlots = Array.from({ length: 7 }, (_, i) => {
        const hour = i + 14;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        const [hours, minutes] = slot.split(':');
        const date = new Date(selectedDay);
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        setSelectedDate(date);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            {/* Header Section */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Select Appointment Time</h2>
                <p className="text-gray-600">
                    Book your consultation with Dr. {selectedDoctor.name}
                </p>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="flex items-center text-lg font-semibold mb-4">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-green-600" />
                    Select Date
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {nextDays.map((date) => (
                        <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDay(date)}
                            className={`p-3 rounded-lg text-center transition-all ${
                                date.toDateString() === selectedDay.toDateString()
                                    ? 'bg-green-500 text-white shadow-md scale-105'
                                    : 'hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <div className="text-sm font-medium">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-lg font-bold">
                                {date.getDate()}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-6">
                {/* Morning Slots */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="flex items-center text-lg font-semibold mb-4">
                        <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
                        Morning Slots
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {morningSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => handleSlotSelect(slot)}
                                className={`relative p-3 rounded-lg text-center transition-all ${
                                    selectedSlot === slot
                                        ? 'bg-green-500 text-white shadow-md'
                                        : 'hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {selectedSlot === slot && (
                                    <CheckCircleIcon className="h-4 w-4 absolute top-1 right-1" />
                                )}
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Afternoon Slots */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="flex items-center text-lg font-semibold mb-4">
                        <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
                        Afternoon Slots
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {afternoonSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => handleSlotSelect(slot)}
                                className={`relative p-3 rounded-lg text-center transition-all ${
                                    selectedSlot === slot
                                        ? 'bg-green-500 text-white shadow-md'
                                        : 'hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {selectedSlot === slot && (
                                    <CheckCircleIcon className="h-4 w-4 absolute top-1 right-1" />
                                )}
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Selected Time Summary */}
            {selectedSlot && (
                <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-medium">
                        Selected appointment time: {formatDate(selectedDay)} at {selectedSlot}
                    </p>
                </div>
            )}
        </div>
    );
};

export default TimeSlotSelection;