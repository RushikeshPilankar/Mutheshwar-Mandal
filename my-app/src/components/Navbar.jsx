import { NavLink } from "react-router-dom";
import logo from "../assets/m.jpg";
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Mutheshwar Mandal Logo" className="navbar-logo" />
        <span>Mutheshwar Mandal</span>
      </div>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/vargani" className={({ isActive }) => (isActive ? "active" : "")}>
          Vargani
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
          Reports
        </NavLink>
      </div>
    </nav>
  );
}