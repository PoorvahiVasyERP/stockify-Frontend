import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/Form/Login/LoginForm";
import "./Login.css";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleLoginSuccess = (role) => {
    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
    navigate("/");
  };

  return (
    <div className="login-container login-background">
      <div className="login-card">
        <div className="login-header">
          <i className="fa-solid fa-warehouse"></i>
          <h1 className="app-title">Stockify</h1>
          <p className="app-subtitle">Inventory Management System</p>
        </div>
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
