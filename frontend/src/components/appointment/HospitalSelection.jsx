import React, { useState } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import { 
  BuildingOffice2Icon, 
  MapPinIcon, 
  PhoneIcon, 
  MagnifyingGlassIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HospitalSelection = () => {
    const { hospitals, setSelectedHospital, loading } = useAppointmentStore();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHospitals = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
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
                <h2 className="text-3xl font-bold text-gray-900">Select Hospital</h2>
                <p className="mt-2 text-gray-600">Choose a hospital to book your appointment</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Search hospitals..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Hospital Cards */}
            <div className="grid gap-4">
                {filteredHospitals.map((hospital) => (
                    <div
                        key={hospital._id}
                        onClick={() => setSelectedHospital(hospital)}
                        className="bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-300 cursor-pointer p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                                {/* Hospital Icon */}
                                <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <BuildingOffice2Icon className="h-8 w-8 text-green-600" />
                                </div>

                                {/* Hospital Info */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                                    
                                    <div className="mt-2 flex items-start space-x-8">
                                        {/* Address */}
                                        <div className="flex items-start">
                                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-gray-600 text-sm">{hospital.address}</p>
                                        </div>

                                        {/* Phone */}
                                        {hospital.contactNumber && (
                                            <div className="flex items-center">
                                                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                <p className="text-gray-600 text-sm">{hospital.contactNumber}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Available Doctors Count */}
                                    <p className="mt-2 text-sm text-green-600 font-medium">
                                        {hospital.doctorsCount || '10+'} Doctors Available
                                    </p>
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
                {filteredHospitals.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No hospitals found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalSelection;