import RegisterForm from "../../components/Form/Register/RegisterForm";
import "./Register.css";

export default function Register() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <i className="fa-solid fa-warehouse"></i>
          <h1 className="app-title">Stockify</h1>
          <p className="app-subtitle">Inventory Management System</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}