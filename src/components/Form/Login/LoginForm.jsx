import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../../services/ApiService";
import Input from "../../Input/Input";
import { loginSchema } from "../../../validation/LoginValidation";
import { toast } from "react-toastify";
import "./LoginForm.css";

export default function LoginForm({ onSuccess }) {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginSchema.validate(form, { abortEarly: false });
      setErrors({});

      const response = await loginUser(form);
      console.log("Login response:", response.data);
      toast.success(response.data.message || "Login successful");

      // Store token if provided
      let token = null;
      if (response.data.token) {
        token = response.data.token;
      } else if (response.data.data?.token) {
        token = response.data.data.token;
      } else if (typeof response.data === 'string' && response.data.length > 50) {
        token = response.data;
      }

      if (token) {
        localStorage.setItem("token", token);
        if (response.data.username) localStorage.setItem("username", response.data.username);
        if (response.data.role) localStorage.setItem("role", response.data.role);
        console.log("Auth data stored");
      } else {
        console.warn("No token found in login response");
      }

      onSuccess(response.data.role || localStorage.getItem("role"));
    } catch (err) {
      if (err.inner) {
        const newErrors = {};
        err.inner.forEach((e) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else {
        const errorMessage = err?.response?.data?.message || err?.message || "Something went wrong.";
        toast.error(errorMessage);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">Username</label>
        <Input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter your username"
          className="form-input"
          autoComplete="username"
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <Input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="form-input"
          autoComplete="current-password"
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

      </div>

      <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
      <button
        type="submit"
        className="login-button"
      >
        Sign In
      </button>
    </form>
  );
}
