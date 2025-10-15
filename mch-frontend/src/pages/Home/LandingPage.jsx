import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div>
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
                    <Link
                        to="/HealthEducation"
                        className="btn btn-warning btn-lg mt-3"
                    >
                        Explore Health Education
                    </Link>
                </div>
            </section>

            {/* Modules Section */}
            <section className="container py-5 text-center">
                <h2 className="mb-4">Choose a Module</h2>
                <div className="row">
                    {[
                        {
                            icon: "bi-person-circle",
                            title: "Public Profile",
                            description:
                                "View and manage public-facing user profiles.",
                            link: "/publicProfile",
                            color: "primary",
                        },
                        {
                            icon: "bi-journal-medical",
                            title: "Health Education",
                            description:
                                "Access articles, videos, and resources for maternal and child health.",
                            link: "/HealthEducation",
                            color: "success",
                        },
                        {
                            icon: "bi-person-badge",
                            title: "Mother Profile",
                            description:
                                "Manage detailed records and care timelines for mothers.",
                            link: "/motherProfile",
                            color: "warning",
                        },
                    ].map((module, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <div
                                className={`card border-${module.color} shadow h-100`}
                            >
                                <div className="card-body">
                                    <i
                                        className={`bi ${module.icon} fs-1 text-${module.color}`}
                                    ></i>
                                    <h5 className="mt-3">{module.title}</h5>
                                    <p>{module.description}</p>
                                    <Link
                                        to={module.link}
                                        className={`btn btn-outline-${module.color}`}
                                    >
                                        Enter Module
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Teaser */}
            <section className="bg-light py-5 text-center">
                <div className="container">
                    <h4>Need Help or Have Questions?</h4>
                    <p>
                        Reach out to our support team for assistance or
                        collaboration opportunities.
                    </p>
                    <Link to="/contact" className="btn btn-dark btn-lg">
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
