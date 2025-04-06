import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import logo from '../assets/logo.jpg';
import { MapIcon } from '@heroicons/react/24/outline';
import MapDrawer from './MapDrawer';

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo on left - now acts as home link */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-16" />
            </Link>

            {/* Right side with user name and menu button */}
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-gray-700 font-medium">
                  Hi, {user.name}
                </span>
              )}
              <button
                onClick={toggleDrawer}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  className="h-8 w-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Add this button for the map drawer */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMapDrawerOpen(true)}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                <MapIcon className="h-6 w-6 mr-2" />
                <span>Map Features</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-20"></div>

      {/* Drawer */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={toggleDrawer}
          />

          {/* Drawer content */}
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-lg z-50 p-6">
            {/* Close button */}
            <button
              onClick={toggleDrawer}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {user && (
              <div className="mb-6 pt-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-green-600">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 capitalize">
                  Role: {user.role}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Profile link moved to drawer */}
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                onClick={toggleDrawer}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </Link>

              {user?.role !== 'doctor' && (
                <Link
                  to="/appointment"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Book Appointment
                </Link>
              )}

              {user?.role !== 'doctor' && (
                <Link
                  to="/my-appointments"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  My Appointments
                </Link>
              )}

              {user?.role !== 'doctor' && (
                <Link
                  to="/preg"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Pregnancy Care
                </Link>
              )}

              {user?.role !== 'doctor' && (
                <Link
                  to="/symptoms"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Check Symptoms
                </Link>
              )}

              {user?.role === 'user' && (
                <Link
                  to="/safety"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Doc Vault
                </Link>
              )}

              {user?.role === 'doctor' && (
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Doctor Dashboard
                </Link>
              )}

              {user?.role === 'doctor' && (
                <Link
                  to="/diagnosis"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Image Analyzer
                </Link>
              )}

              {user?.role !== 'doctor' && (
                <Link
                  to="/counsellor"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Counsellor
                </Link>
              )}

              {user?.role !== 'doctor' && (
                <Link
                  to="https://cde-seven.vercel.app/"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Medicine Checker
                </Link>
              )}


              {user ? (
                <button
                  onClick={() => {
                    logout();
                    toggleDrawer();
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-red-600 w-full"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-gray-700"
                  onClick={toggleDrawer}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Login/Signup
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      <MapDrawer
        isOpen={isMapDrawerOpen}
        setIsOpen={setIsMapDrawerOpen}
      />
    </>
  );
};

export default Navbar;