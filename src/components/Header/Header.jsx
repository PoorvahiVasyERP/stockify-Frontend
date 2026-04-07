import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Modal from "../Modal/Modal";
import LoginForm from "../Form/Login/LoginForm";
import { toast } from "react-toastify";
import { getNotifications, clearNotifications } from "../../services/ApiService";
import "./Header.css";

export default function Header() {
  const [showInfo, setShowInfo] = useState(false);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!username) return;

    getNotifications(username).then(res => {
      setNotifications(res.data.map(n => n.message));
    }).catch(err => console.error("Error fetching notifications", err));

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe(`/topic/notifications/${username}`, msg => {
          setNotifications(prev => [...prev, msg.body]);
          toast.info(msg.body);
        });
      },
    });
    client.activate();
    return () => client.deactivate();
  }, [username]);

  const handleProfileClick = () => {
    if (username) {
      setShowInfo(!showInfo);
    }
  };

  return (
    <header className="header" onClick={() => setShowInfo(false)}>
      <div className="header-brand">
        <h3>
          Stockify
          <span className="header-sub">Inventory Management System</span>
        </h3>
      </div>
      <div className="header-user" onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
        
        <div style={{ position: "relative", marginRight: "25px", cursor: "pointer" }} onClick={() => setShowNotifications(!showNotifications)}>
          <i className="fa-solid fa-bell" style={{ fontSize: "1.4rem", color: "#e94560" }} />
          {notifications.length > 0 && (
            <span style={{ color:"white", position: "absolute", top: "-8px", right: "-10px", background: "red", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "0.7rem", fontWeight: "bold" }}>
              {notifications.length}
            </span>
          )}
          {showNotifications && (
            <div className="user-dropdown-info" style={{ right: "-50px", width: "250px", maxHeight: "300px", overflowY: "auto" }}>
              <h4 style={{ color: "#f1f1f1" }}>Notifications</h4>
              {notifications.length === 0 ? <p>No new notifications</p> : 
                notifications.map((n, i) => <div key={i} style={{ borderBottom: "1px solid #ccc", padding: "5px 0", fontSize: "0.9rem", color: "#f1f1f1" }}>{n}</div>)
              }
              {notifications.length > 0 && <button onClick={() => {
                  clearNotifications(username).then(() => setNotifications([])).catch(err => console.error(err));
                }} style={{marginTop: "5px", fontSize: "0.8rem", padding: "2px 5px", width: "100%", color:"white"}}>Clear</button>}
            </div>
          )}
        </div>

        <div 
          className="header-profile" 
          onClick={handleProfileClick} 
          style={{ cursor: "pointer", position: "relative" }}
        >
          <i className="fa-solid fa-user-circle" style={{ fontSize: "1.4rem", marginRight: "10px", color: "#e94560" }}></i>
          <span>Profile</span>
          
          {showInfo && username && (
            <div className="user-dropdown-info">
              <p>Name- {username}</p>
              <p>Role- {role?.replace("ROLE_", "")}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
