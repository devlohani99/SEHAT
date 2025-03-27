import { useAuthStore } from "../store/auth.store.js";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/login"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Profile</h1>
      {user ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-80 mt-4">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button 
            onClick={handleLogout} 
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>
      ) : (
        <p className="text-red-500">No user data available</p>
      )}
    </div>
  );
};

export default Profile;
