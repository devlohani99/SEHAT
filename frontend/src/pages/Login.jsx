import { useState } from "react";
import { useAuthStore } from "../store/auth.store.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      alert("Login successful!");
      navigate("/profile"); 
    } catch (error) {
      alert(error); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Login
      </button>
    </form>
  );
}

export default Login;
