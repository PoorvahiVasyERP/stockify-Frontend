import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import { toast } from "react-toastify";
import "../Login/Login.css"; // Reuse login page styles

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate password reset logic
    toast.success("Password reset instructions have been sent to your email.");
    setTimeout(() => {
        navigate("/login");
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="fa-solid fa-warehouse"></i>
          <h1 className="app-title">Stockify</h1>
          <p className="app-subtitle">Reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username / Email</label>
            <Input
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered username or email"
              className="form-input"
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <Link to="/login" className="register-link">Back to Login</Link>
          </div>
          <button type="submit" className="login-button">Send Reset Instructions</button>
        </form>
      </div>
    </div>
  );
}