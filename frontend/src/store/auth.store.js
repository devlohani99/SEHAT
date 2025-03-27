import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true, // Loading state to track if user data is being fetched

  // Signup method
  signup: async (userData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userData
      );
      return res.data;
    } catch (error) {
      throw error.response?.data?.error || "Signup failed";
    }
  },

  // Login method
  login: async (credentials) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      localStorage.setItem("token", res.data.token);
      set({ user: res.data.user, token: res.data.token, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      throw error.response?.data?.error || "Login failed";
    }
  },

  // Logout method
  logout: async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.error || error.message
      );
      set({ loading: false });
    }
  },

  // Automatically check if the user is logged in when the app loads
  checkAuthStatus: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token, loading: false }); // Token is present, assume user is logged in
      // You can also add a backend call here to verify token validity if needed
    } else {
      set({ loading: false }); // No token found, assume user is not logged in
    }
  },
}));
