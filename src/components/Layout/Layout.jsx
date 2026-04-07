import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../footer/Footer";

export default function Layout({ role }) {
  return (
    <>
      <Header />
      <div className="app-container">
        <div className="sidebar">
          <Sidebar role={role} />
        </div>

        <div className="main-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}
