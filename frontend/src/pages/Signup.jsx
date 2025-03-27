import { useState } from "react";
import { useAuthStore } from "../store/auth.store.js";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      alert("Signup successful! Redirecting to login...");
      navigate("/login"); 
    } catch (error) {
      alert(error); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="doctor">Doctor</option>
        <option value="pharmacy">Pharmacy</option>
      </select>
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Signup</button>
    </form>
  );
}

export default Signup;
