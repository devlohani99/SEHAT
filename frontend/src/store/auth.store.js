import axios from "axios";
import { create } from "zustand";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: true,
  error: null,
  role: localStorage.getItem("userRole") || "user",

  // Check authentication status
  checkAuth: async () => {
    try {
      set({ loading: true, error: null });

      const response = await fetch("http://localhost:5000/api/auth/check", {
        method: "GET",
        credentials: "include", // Important for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        localStorage.removeItem("userRole");
        set({
          user: null,
          loading: false,
          role: "user",
          error: null,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        set({
          user: data.user,
          role: data.user.role,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem("userRole");
      set({
        user: null,
        loading: false,
        role: "user",
        error: "Authentication failed",
      });
    }
  },

  // Signup method (keeping your existing code)
  signup: async (userData) => {
    try {
      set({ loading: true, error: null });
      console.log("Sending signup data:", userData);

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.message || "Signup failed", loading: false });
        return false;
      }

      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Login method (keeping your existing code)
  login: async (email, password, role) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ error: data.message || "Login failed", loading: false });
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", role);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        role: role,
      });

      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  // Logout method (keeping your existing code)
  logout: async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      set({
        user: null,
        token: null,
        loading: false,
        role: "user",
        error: null,
      });
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.error || error.message
      );
      set({ loading: false });
    }
  },

  chat: async (message) => {
    set({ isProcessing: true, err: null });
    try {
      const res = await axios.post(`http://localhost:5000/api/counselor/`, { message }, { withCredentials: true });
      console.log("Backend response:", res.data); // Debug full response
      set({ isProcessing: false });
      return res.data.message; // Return only the message string
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to get response";
      console.error("Chat Error:", errorMessage, error.response?.data || error);
      set({ isProcessing: false, err: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchUnsafeLocations: async () => {
    set({ isLoadingLocations: true, locationError: null });
    try {
      const res = await axios.get("http://localhost:5000/api/unsafe");
      set({ unsafeLocations: res.data, isLoadingLocations: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch locations";
      console.error("Fetch Locations Error:", errorMessage, error.response?.data);
      set({ locationError: errorMessage, isLoadingLocations: false });
      throw new Error(errorMessage);
    }
  },

  markLocationAsUnsafe: async (lat, lng) => {
    set({ isLoadingLocations: true, locationError: null });
    try {
      const res = await axios.post("http://localhost:5000/api/unsafe", { lat: parseFloat(lat), lng: parseFloat(lng) });
      set((state) => ({ unsafeLocations: [...state.unsafeLocations, res.data], isLoadingLocations: false }));
      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to mark location";
      console.error("Mark Location Error:", errorMessage, error.response?.data);
      set({ locationError: errorMessage, isLoadingLocations: false });
      throw new Error(errorMessage);
    }
  },
  
}));
