import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-100">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <img src="/gpg.png" alt="health" className="me-2" style={{maxWidth: "150px"}} />
          <Link className="navbar-brand fw-bold" to="/">PostnatalCare+</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/pregnancy-stages">Pregnancy Stages</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/safe-medicines">Safe Medicines</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/visit-list">Visit List</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/hospital-dashboard">Hospital Dashboard</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-light py-5 text-center" style={{ backgroundImage: 'url(/Picture2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="display-5 fw-bold">Empowering Postnatal Care</h1>
          <p className="lead">Track visits, explore pregnancy stages, and manage hospital insights — all in one place.</p>
          <Link to="/pregnancy-stages" className="btn btn-primary btn-lg mt-3">Get Started</Link>
        </div>
      </header>

      {/* Featured Modules */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <i className="bi bi-heart-pulse fs-1 text-primary"></i>
            <h4 className="mt-3">Pregnancy Stages</h4>
            <p>Learn what to expect in each trimester and how to prepare.</p>
            <Link to="/pregnancy-stages" className="btn btn-outline-primary btn-sm">Explore</Link>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-capsule fs-1 text-success"></i>
            <h4 className="mt-3">Safe Medicines</h4>
            <p>Find approved medications for pregnancy and breastfeeding.</p>
            <Link to="/safe-medicines" className="btn btn-outline-success btn-sm">View List</Link>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-clipboard-data fs-1 text-warning"></i>
            <h4 className="mt-3">Visit History</h4>
            <p>Track postnatal visits and access detailed records.</p>
            <Link to="/visit-list" className="btn btn-outline-warning btn-sm">View Visits</Link>
          </div>
        </div>
      </section>

      {/* Dashboard Promotion */}
      <section className="bg-primary text-white py-5 text-center">
        <div className="container">
          <h2>Hospital Dashboard</h2>
          <p>Monitor trends, manage departments, and improve care delivery.</p>
          <Link to="/hospital-dashboard" className="btn btn-light btn-lg">Launch Dashboard</Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-5 text-center">
        <h3>Our Mission</h3>
        <p className="lead">We believe every mother and child deserves accessible, informed, and compassionate care. Our platform helps health workers and families stay connected and empowered.</p>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p>&copy; {new Date().getFullYear()} PostnatalCare+. All rights reserved.</p>
          <div>
            <Link to="/privacy" className="text-white me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-white">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
