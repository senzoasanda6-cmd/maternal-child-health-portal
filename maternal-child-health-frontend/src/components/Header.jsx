import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth tokens or session here
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <img src="/gpg.png" alt="health" style={{ height: "40px", marginRight: "10px" }} />
        <Link className="navbar-brand fw-bold" to="/mother/home">PostnatalCare+</Link>
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
            <li className="nav-item"><Link className="nav-link" to="/PregnancyStages">Pregnancy Stages</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/SafeMedicines">Safe Medicines</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/postnatal-visits/1">Visit List</Link></li>
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
