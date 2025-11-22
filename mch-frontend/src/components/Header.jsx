import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens or session here
    localStorage.removeItem("authToken");
    // localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-4 px-2">
      <div className="container">
        <Link className="fw-bold text-custom-color-primary" to="/mother/home" style={{ textDecoration: "none", fontSize: "20px" }}>
          <img src="/gpg.png" alt="health" className="navbar-brand" style={{ height: "40px", marginRight: "12px" }} /> 
          <span>PostnatalCare+</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><Link className="nav-link" to="/pregnancy-stages">Pregnancy Stages</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/safe-medicines">Safe Medicines</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/health/postnatal-visits">Visit List</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/health/dashboard">Hospital Dashboard</Link></li>
            <li className="nav-item">
              <button className="btn btn-outline-danger btn-sm ms-3" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
