import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/PublicFooter";

const Home = () => {
  return (
    <div className="w-100">
      {/* Navigation */}
      <Header />

      {/* Hero Section */}
      <header className="bg-light py-5 text-center shadow-sm" style={{ backgroundImage: 'url(/Picture2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container">
          <h1 className="display-5 fw-bold text-custom-color-primary">Empowering Postnatal Care</h1>
          <p className="lead mb-4">Track visits, explore pregnancy stages, and manage hospital insights — all in one place.</p>
          <Link to="/pregnancy-stages" className="button button-primary btn-lg mt-3">Get Started</Link>
        </div>
      </header>

      {/* Featured Modules */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <i className="bi bi-heart-pulse fs-1 text-primary"></i>
            <h4 className="mt-3 fw-bold text-custom-color-primary">Pregnancy Stages</h4>
            <p>Learn what to expect in each trimester and how to prepare.</p>
            <Link to="/pregnancy-stages" className="btn btn-outline-primary shadow rounded-3">Explore</Link>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-capsule fs-1 text-success"></i>
            <h4 className="mt-3 fw-bold text-custom-color-primary">Safe Medicines</h4>
            <p>Find approved medications for pregnancy and breastfeeding.</p>
            <Link to="/safe-medicines" className="btn btn-outline-success shadow rounded-3">View List</Link>
          </div>
          <div className="col-md-4 mb-4">
            <i className="bi bi-clipboard-data fs-1 text-warning"></i>
            <h4 className="mt-3 fw-bold text-custom-color-primary">Visit History</h4>
            <p>Track postnatal visits and access detailed records.</p>
            <Link to="/visit-list" className="btn btn-outline-warning shadow rounded-3">View Visits</Link>
          </div>
        </div>
      </section>

      {/* Dashboard Promotion */}
      <section className="bg-custom-color-accent text-white py-5 text-center">
        <div className="container">
          <h2 className=" fw-bold text-custom-color-primary p-0 m-0 border-0">Hospital Dashboard</h2>
          <hr className="border-custom-color-primary" />
          <p className="text-custom-color-primary mb-4">Monitor trends, manage departments, and improve care delivery.</p>
          <Link to="/hospital-dashboard" className="button button-light btn-lg">Launch Dashboard</Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container py-5 text-center">
        <h3 className=" fw-bold text-custom-color-primary">Our Mission</h3>
        <p className="lead">We believe every mother and child deserves accessible, informed, and compassionate care. Our platform helps health workers and families stay connected and empowered.</p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
