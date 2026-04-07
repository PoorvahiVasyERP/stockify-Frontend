import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { logout } from "../../services/ApiService";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sidebar-container">
      <h3>Main Menu</h3>  
      <ul>
        <li>
          <Link to="/" className="link">
            <i className="fa fa-tachometer"></i>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/products" className="link">
            <i className="fa fa-cube"></i> Product
          </Link>
        </li>
        <li>
          <Link to="/purchase" className="link">
            <i className="fa fa-shopping-cart"></i>
            Purchase
          </Link>
        </li>
        <li>
          <Link to="/sales" className="link">
            <i className="fa fa-line-chart"></i>
            Sales
          </Link>
          <Link to="/warehouse" className="link">
           <i className="fa-solid fa-warehouse"></i>
            Warehouse
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="link" style={{width: '219px', marginTop:'190px'}}>
            <i className="fa fa-sign-out"></i>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
