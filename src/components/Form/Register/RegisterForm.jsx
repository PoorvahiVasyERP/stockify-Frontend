import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/ApiService";
import Input from "../../Input/Input";
import { toast } from "react-toastify";
import "../Login/LoginForm.css";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting registration for:", form.username);
      const response = await registerUser({
        username: form.username,
        password: form.password
      });
      
      console.log("Registration response:", response);
      toast.success(response.data?.message || "Registration successful! Please login.");
      
      // Delay navigation slightly so user sees the success message
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Registration failed. Please check your connection.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <Input
        label="Username"
        name="username"
        type="text"
        value={form.username}
        onChange={handleChange}
        placeholder="Choose a username"
        className="form-input"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Create a password"
        className="form-input"
        required
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        className="form-input"
        required
      />

      <div style={{ marginBottom: "1.5rem", textAlign: "right" }}>
        <Link to="/login" className="register-link" style={{ fontSize: "0.9rem" }}>
          Already a member? Login here
        </Link>
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
