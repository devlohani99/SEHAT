import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const useDoctorStore = create((set) => ({
  appointments: [],
  loading: false,
  error: null,

  fetchAllAppointments: async () => {
    try {
      set({ loading: true, error: null });
      // Get all appointments instead of filtering by doctor
      const response = await axios.get(`${API_URL}/appointment`);
      set({ appointments: response.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDoctorAppointments: async (doctorId) => {
    try {
      set({ loading: true, error: null });
      // Still keep this method for when there is a logged-in doctor
      if (!doctorId) {
        // If no doctor ID, get all appointments
        const response = await axios.get(`${API_URL}/appointment`);
        set({ appointments: response.data });
      } else {
        const response = await axios.get(`${API_URL}/appointment/doctor/${doctorId}`);
        set({ appointments: response.data });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(`${API_URL}/appointment/${appointmentId}/status`, { status });
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt._id === appointmentId ? response.data : apt
        ),
      }));
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDoctorStore;