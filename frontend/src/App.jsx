// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth.store.js';
import ProtectedRoute from './components/ProtectedRoute';
import RestrictedRoute from './components/RestrictedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Appointment from './pages/AppointmentBooking.jsx';
import MyAppointments from './pages/MyAppointment.jsx';
import Symptom from './pages/Symptom';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ImageUploader from './components/imageUploader.jsx';
import Preg from './components/Preg.jsx';
import Counselor from './pages/Counselor.jsx';
import Maps from './pages/Maps.jsx';
import SafeRoute from './pages/safeRoute.jsx';
import All from './pages/All.jsx';
import Diagnosis from "./pages/Diagnosis.jsx"
function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Restricted Routes (only for non-authenticated users) */}
        <Route path="/login" element={
          <RestrictedRoute>
            <Login />
          </RestrictedRoute>
        } />
        <Route path="/signup" element={
          <RestrictedRoute>
            <Signup />
          </RestrictedRoute>
        } />

        {/* Protected Routes (only for authenticated users) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/appointment" element={
          <ProtectedRoute>
            <Appointment />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <MyAppointments />
          </ProtectedRoute>
        } />
        <Route path="/symptoms" element={
          <ProtectedRoute>
            <Symptom />
          </ProtectedRoute>
        } />
        <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/safety" element={<ProtectedRoute><ImageUploader /></ProtectedRoute>} />
        <Route path="/preg" element={<ProtectedRoute><Preg /></ProtectedRoute>} />
        <Route path="/counsellor" element={<ProtectedRoute><Counselor /></ProtectedRoute>} />
        <Route path="/all" element={<All />} />
        <Route path="/unsafe" element={<Maps />} />
        <Route path="/safe" element={<SafeRoute />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
      </Routes>
    </div>
  );
}

export default App;