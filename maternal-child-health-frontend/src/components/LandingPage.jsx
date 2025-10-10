import React from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import Nav from "./nav.jsx";

const LandingPage = () => {
    return (
        <>
            <Nav />
            

            <main>
                <section className="hero">
                    <h1>Supporting Healthy Futures</h1>
                    <p>Your trusted partner in maternal and child health.</p>
                    <Link to="/register" className="button button-accent">
                        Get Started
                    </Link>
                </section>

                <section id="services" className="section section-grey">
                    <div className="container">
                        <h2>Our Services</h2>
                        <div className="services-grid">
                            <div className="service-card">
                                <img
                                    src={`${process.env.PUBLIC_URL}/sample_images/Picture1.jpg`}
                                    alt="Prenatal Care"
                                />
                                <div className="service-card-content">
                                    <h3>Prenatal Care</h3>
                                    <p>
                                        Comprehensive support throughout your
                                        pregnancy journey, from the first
                                        trimester to delivery.
                                    </p>
                                </div>
                            </div>
                            <div className="service-card">
                                <img
                                    src="/Picture2.jpg"
                                    alt="Child Wellness"
                                />
                                <div className="service-card-content">
                                    <h3>Child Wellness</h3>
                                    <p>
                                        Track your child's growth, vaccinations,
                                        and developmental milestones with our
                                        expert guidance.
                                    </p>
                                </div>
                            </div>
                            <div className="service-card">
                                <img
                                    src={`${process.env.PUBLIC_URL}/sample_images/Picture3.jpg`}
                                    alt="Postnatal Support"
                                />
                                <div className="service-card-content">
                                    <h3>Postnatal Support</h3>
                                    <p>
                                        Guidance and care for mothers and
                                        newborns in the critical weeks after
                                        birth.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="section">
                    <div className="container about-section">
                        <img
                            src={`${process.env.PUBLIC_URL}/sample_images/Picture4.jpg`}
                            alt="Doctor with patient"
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
