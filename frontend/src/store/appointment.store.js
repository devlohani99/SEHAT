import { create } from "zustand";
import axios from "axios";

export const useAppointmentStore = create((set) => ({
  hospitals: [],
  doctors: [],
  selectedHospital: "",
  selectedDoctor: "",
  selectedTimeSlot: "",
  loading: false,
  error: null,

  fetchHospitals: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get("http://localhost:5000/api/hospital");
      set({ hospitals: data, loading: false });
    } catch (error) {
        console.log(error)
      set({ error: "Failed to fetch hospitals", loading: false });
    }
  },

  fetchDoctors: async (hospitalId) => {
    try {
      set({ loading: true });
      const { data } = await axios.get(`http://localhost:5000/api/doctor/hospital/${hospitalId}`);
      set({ doctors: data, loading: false });
    } catch (error) {
        console.log(error)
      set({ error: "Failed to fetch doctors", loading: false });
    }
  },

  setSelectedHospital: (hospitalId) => set({ selectedHospital: hospitalId }),
  setSelectedDoctor: (doctorId) => set({ selectedDoctor: doctorId }),
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
}));
