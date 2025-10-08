import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">Postnatal Care</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/pregnancy-stages">Pregnancy Stages</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/safe-medicines">Safe Medicines</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/visit-list">Visit List</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/hospital-dashboard">Hospital Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="container py-5 text-center">
        <h1 className="mb-4">Welcome to the Postnatal Care Portal</h1>
        <p className="lead">Track visits, explore pregnancy stages, and manage hospital insights — all in one place.</p>
        <Link to="/pregnancy-stages" className="btn btn-primary mt-3">Get Started</Link>
      </div>
    </div>
  );
};

export default Home;
