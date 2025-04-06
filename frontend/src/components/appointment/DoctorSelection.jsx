import React, { useState } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import { 
  UserIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  StarIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const DoctorSelection = () => {
    const { doctors, selectedHospital, setSelectedDoctor, loading } = useAppointmentStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Select Doctor</h2>
                <p className="mt-2 text-gray-600">Choose from our specialists at {selectedHospital.name}</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialization..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Doctor Cards */}
            <div className="grid gap-4">
                {filteredDoctors.map((doctor) => (
                    <div
                        key={doctor._id}
                        className="bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300 cursor-pointer p-6"
                        onClick={() => setSelectedDoctor(doctor)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                {/* Doctor Avatar */}
                                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="w-20 h-20 rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="h-10 w-10 text-green-600" />
                                    )}
                                </div>

                                {/* Doctor Info */}
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-xl font-semibold text-gray-900">Dr. {doctor.name}</h3>
                                        <div className="flex items-center">
                                            <StarIcon className="h-5 w-5 text-yellow-400" />
                                            <span className="ml-1 text-sm text-gray-600">{doctor.rating || '4.5'}</span>
                                        </div>
                                    </div>

                                    <p className="mt-1 text-green-600 font-medium">{doctor.specialization}</p>

                                    <div className="mt-3 flex flex-wrap items-center gap-4">
                                        {/* Experience */}
                                        <div className="flex items-center">
                                            <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                                {doctor.experience} Years Experience
                                            </span>
                                        </div>

                                        {/* Contact */}
                                        <div className="flex items-center">
                                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">{doctor.contactNumber}</span>
                                        </div>

                                        {/* Available Time */}
                                        <div className="flex items-center">
                                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">Available Today</span>
                                        </div>
                                    </div>

                                    {/* Specialties/Tags */}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {doctor.specialties?.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="text-gray-400 hover:text-green-500 transition-colors">
                                <ArrowRightIcon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                ))}

                {/* No Results State */}
                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No doctors found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorSelection;