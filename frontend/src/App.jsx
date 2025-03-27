import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Symptom from './pages/Symptom';
import AppointmentForm from './pages/AppointmentForm';
import { useEffect } from 'react';
import { useAuthStore } from './store/auth.store';

const App = () => {
  const { checkAuthStatus, loading } = useAuthStore();
  
  useEffect(() => {
    checkAuthStatus(); // Check if user is logged in or not when the app loads
  }, [checkAuthStatus]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state until we know if the user is logged in
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/symptom" element={<Symptom/>}/>
        <Route path="/appointment" element={<AppointmentForm/>}/>
      </Routes>
    </>
  );
};
export default App;