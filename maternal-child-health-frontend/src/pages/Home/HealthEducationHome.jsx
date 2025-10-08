import React from "react";
import { Link } from "react-router-dom";

const HealthEducationHome = () => {
    return (
        <div className="row">
            {/* Sidebar Navigation */}
            <aside className="col-md-3 bg-light border-end py-4">
                <nav className="nav flex-column px-3">
                    <h5 className="mb-3">Health Education</h5>
                    <Link to="/PregnancyStages" className="nav-link">
                        Pregnancy Stages
                    </Link>
                    <Link to="/SafeMedicines" className="nav-link">
                        Safe Medicines
                    </Link>
                    <Link to="/postnatal-visits/1" className="nav-link">
                        Visit History
                    </Link>
                    <Link to="/dashboard" className="nav-link">
                        Hospital Dashboard
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="col-md-9 py-4">
                {/* Intro Paragraph */}
                <section className="mb-4">
                    <h2>Welcome to Health Education</h2>
                    <p>
                        This module provides essential information and tools to
                        support maternal and child health. Learn about pregnancy
                        stages, safe medications, and track postnatal visits to
                        ensure informed care.
                    </p>
                </section>

                {/* Feature Cards */}
                <section className="row text-center">
                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <i className="bi bi-heart-pulse fs-1 text-primary"></i>
                                <h5 className="mt-3">Pregnancy Stages</h5>
                                <p>
                                    Learn what to expect in each trimester and
                                    how to prepare.
                                </p>
                                <Link
                                    to="/PregnancyStages"
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    Explore
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <i className="bi bi-capsule fs-1 text-success"></i>
                                <h5 className="mt-3">Safe Medicines</h5>
                                <p>
                                    Find approved medications for pregnancy and
                                    breastfeeding.
                                </p>
                                <Link
                                    to="/SafeMedicines"
                                    className="btn btn-outline-success btn-sm"
                                >
                                    View List
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Resource Library Section */}
                    <section className="mt-5">
                        <h3 className="mb-4">Resource Library</h3>
                        <p>
                            Browse curated educational materials to support
                            mothers, families, and health workers. These
                            resources include articles, videos, printable
                            guides, and interactive tools.
                        </p>

                        <div className="row">
                            {[
                                {
                                    title: "Nutrition During Pregnancy",
                                    type: "Article",
                                    icon: "bi-book",
                                    link: "/resources/nutrition",
                                    color: "primary",
                                },
                                {
                                    title: "Postnatal Care Checklist",
                                    type: "Downloadable Guide",
                                    icon: "bi-file-earmark-pdf",
                                    link: "/resources/postnatal-checklist",
                                    color: "success",
                                },
                                {
                                    title: "Breastfeeding Tips",
                                    type: "Video",
                                    icon: "bi-play-circle",
                                    link: "/breastfeeding-video.mp4",
                                    color: "warning",
                                },
                            ].map((resource, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div
                                        className={`card border-${resource.color} h-100 shadow-sm`}
                                    >
                                        <div className="card-body text-center">
                                            <i
                                                className={`bi ${resource.icon} fs-1 text-${resource.color}`}
                                            ></i>
                                            <h5 className="mt-3">
                                                {resource.title}
                                            </h5>
                                            <p className="text-muted">
                                                {resource.type}
                                            </p>
                                            <Link
                                                to={resource.link}
                                                className={`btn btn-outline-${resource.color} btn-sm`}
                                            >
                                                View Resource
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <i className="bi bi-clipboard-data fs-1 text-warning"></i>
                                <h5 className="mt-3">Visit History</h5>
                                <p>
                                    Track postnatal visits and access detailed
                                    records.
                                </p>
                                <Link
                                    to="/postnatal-visits/1"
                                    className="btn btn-outline-warning btn-sm"
                                >
                                    View Visits
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HealthEducationHome;
