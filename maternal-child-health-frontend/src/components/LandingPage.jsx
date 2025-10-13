import React from "react";
import { Link } from "react-router-dom";
import Nav from "./nav.jsx";
import "./HomePage.css"; // Ensure this includes your style guide CSS

const LandingPage = () => {
    return (
        <>
            <Nav />

            {/* Hero Section */}
            <section
                className="position-relative text-white d-flex align-items-center justify-content-center"
                style={{ height: "100vh", overflow: "hidden" }}
            >
                {/* Video Background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    className="position-absolute w-100 h-100 object-fit-cover"
                    style={{ zIndex: -1 }}
                >
                    <source src="/hero-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Overlay Content */}
                <div className="text-center bg-dark bg-opacity-50 p-5 rounded">
                    <h1 className="display-4 fw-bold">
                        Maternal Child Health Portal
                    </h1>
                    <p className="lead">
                        Empowering families and health workers with smart tools
                        and education.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                        <Link
                            to="/health/education"
                            className="button button-accent"
                        >
                            Explore Health Education
                        </Link>
                        <Link to="/register" className="button button-primary">
                            Start Tracking Your Health
                        </Link>
                        <Link
                            to="/admin-dashboard"
                            className="button button-secondary"
                        >
                            Admin Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Health Tip Banner */}
            <section className="bg-warning text-dark py-3 text-center">
                <strong>Tip:</strong> Breastfeeding within the first hour boosts
                immunity.
            </section>

            <main>
                {/* Services Section */}
                <section id="services" className="section section-grey">
                    <div className="container">
                        <h2>Our Services</h2>
                        <div className="services-grid">
                            <div className="card">
                                <img
                                    src={`${process.env.PUBLIC_URL}/sample_images/Picture1.jpg`}
                                    alt="Prenatal Care"
                                    className="w-100"
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src = "/fallback.jpg")
                                    }
                                />
                                <h3>Prenatal Care</h3>
                                <p>
                                    Comprehensive support throughout your
                                    pregnancy journey, from the first trimester
                                    to delivery.
                                </p>
                            </div>

                            <div className="card">
                                <img
                                    src={`${process.env.PUBLIC_URL}/Child-Wellness.png`}
                                    alt="Child Wellness"
                                    className="w-100"
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src = "/fallback.jpg")
                                    }
                                />
                                <h3>Child Wellness</h3>
                                <p>
                                    Track your child's growth, vaccinations, and
                                    developmental milestones with our expert
                                    guidance.
                                </p>
                            </div>

                            <div className="card">
                                <img
                                    src={`${process.env.PUBLIC_URL}/sample_images/Picture3.jpg`}
                                    alt="Postnatal Support"
                                    className="w-100"
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                    onError={(e) =>
                                        (e.target.src = "/fallback.jpg")
                                    }
                                />
                                <h3>Postnatal Support</h3>
                                <p>
                                    Guidance and care for mothers and newborns
                                    in the critical weeks after birth.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="section">
                    <div className="container about-section">
                        <img
                            src={`${process.env.PUBLIC_URL}/sample_images/Picture4.jpg`}
                            alt="Doctor with patient"
                            className="img-fluid"
                            style={{ borderRadius: "8px", maxWidth: "100%" }}
                            onError={(e) => (e.target.src = "/fallback.jpg")}
                        />
                        <div>
                            <h2>About Our Portal</h2>
                            <p>
                                The Maternal Child Health Portal is a digital
                                platform designed to empower mothers and
                                healthcare providers with the tools and
                                information needed for a healthy pregnancy and
                                early childhood. Our mission is to make
                                essential health tracking simple, accessible,
                                and secure.
                            </p>
                            <p>
                                We connect patients with their care teams,
                                provide timely reminders, and offer a wealth of
                                educational resources.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>
                    &copy; 2025 Maternal Child Health Portal. All Rights
                    Reserved.
                </p>
            </footer>
        </>
    );
};

export default LandingPage;
