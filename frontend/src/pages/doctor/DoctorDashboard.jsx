import React, { useEffect, useState } from 'react';
import useDoctorStore from '../../store/doctorStore';
import {
    CalendarIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
    const { fetchAllAppointments, appointments, loading, error, updateAppointmentStatus } = useDoctorStore();
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchAllAppointments();
    }, [fetchAllAppointments]);

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await updateAppointmentStatus(appointmentId, newStatus);
            // Refresh appointments after update
            fetchAllAppointments();
        } catch (err) {
            console.error('Error updating appointment:', err);
        }
    };

    const filteredAppointments = statusFilter === 'all'
        ? appointments
        : appointments.filter(apt => apt.status === statusFilter);

    // Calculate statistics including pending
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled').length;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
                    <p className="text-red-600 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Dashboard</h1>

                {/* Statistics Cards - Add Pending Card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <CalendarIcon className="h-8 w-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <ClockIcon className="h-8 w-8 text-yellow-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{pendingAppointments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-8 w-8 text-green-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center">
                            <XCircleIcon className="h-8 w-8 text-red-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Cancelled</p>
                                <p className="text-2xl font-bold text-gray-900">{cancelledAppointments}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons - Add Pending Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                        <button
                            className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'all'
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            onClick={() => setStatusFilter('all')}
                        >
                            All Appointments
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'pending'
                                ? 'bg-yellow-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            onClick={() => setStatusFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'completed'
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            onClick={() => setStatusFilter('completed')}
                        >
                            Completed
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full transition-all ${statusFilter === 'cancelled'
                                ? 'bg-red-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            onClick={() => setStatusFilter('cancelled')}
                        >
                            Cancelled
                        </button>
                    </div>
                </div>

                {/* Updated Table with Actions */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <CalendarIcon className="h-12 w-12 text-gray-400 mb-2" />
                                                <p className="text-gray-600 font-medium">No appointments found</p>
                                                <p className="text-gray-400 text-sm">Try changing the filter or check back later</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((appointment) => (
                                        <tr key={appointment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <span className="text-xl text-gray-600">
                                                            {appointment.user?.name?.charAt(0) || "G"}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {appointment.user?.name || "Guest Patient"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">Dr. {appointment.doctor?.name || "Unknown"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {appointment.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                                            className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center"
                                                        >
                                                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                                            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center"
                                                        >
                                                            <XCircleIcon className="h-4 w-4 mr-1" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {appointment.status === 'completed' && (
                                                    <span className="text-green-600 flex items-center">
                                                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                                                        Completed
                                                    </span>
                                                )}
                                                {appointment.status === 'cancelled' && (
                                                    <span className="text-red-600 flex items-center">
                                                        <XCircleIcon className="h-5 w-5 mr-1" />
                                                        Cancelled
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;