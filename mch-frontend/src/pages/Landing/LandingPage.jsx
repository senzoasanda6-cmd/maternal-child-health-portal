import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard.jsx";
import LevelOfCareHospitalCard from "../../components/LevelOfCareHospitalCard.jsx";

const LandingPage = () => {
    const services = [
        {
            imageUrl: "/sample_images/Picture1.jpg",
            title: "Prenatal Care",
            description:
                "Comprehensive support throughout your pregnancy journey, from the first trimester to delivery.",
            navigateTo: `/mch-services/prenatal-care`,
        },
        {
            imageUrl: "/sample_images/Picture2.jpg",
            title: "Labour & Delivery",
            description:
                "Support and clinical care during labour and delivery to ensure safe childbirth.",
            navigateTo: `/mch-services/labour-delivery`,
        },
        {
            imageUrl: "/sample_images/Picture3.jpg",
            title: "Postnatal Support",
            description:
                "Guidance and care for mothers and newborns in the critical weeks after birth.",
            navigateTo: `/mch-services/postnatal-support`,
        },
        {
            imageUrl: "/Child-Wellness.png",
            title: "Child Wellness",
            description:
                "Track your child's growth, vaccinations, and developmental milestones with our expert guidance.",
            navigateTo: `/mch-services/child-wellness`,
        },
        {
            imageUrl: "/sample_images/thumbnail_AdobeStock_527959482.jpg.webp",
            title: "Immunisations",
            description:
                "Keep your child protected with recommended vaccinations and immunisation schedules.",
            navigateTo: `/mch-services/immunisations`,
        },
    ];

    const perHospMaternalServices = [
        {
            imageUrl: "/hospital_images/dgmah/dgmah.jpg",
            title: "Central Hospitals",
            description:
                "Comprehensive support throughout your pregnancy journey, from the first trimester to delivery.",
            hospitals: {
                imageUrl: "/hospital_images/dgmah/dgmah.jpg",
                title: "Chris Hani Baragwanath Academic Hospital",
                summary:
                    "Offers comprehensive maternal services including prenatal care, delivery, and postnatal support. Known for its large capacity and skilled staff.",
                fblink: "#",
                top3services: [
                    "Prenatal Care",
                    "Labour & Delivery",
                    "Postnatal Support",
                ],
            },
        },
        {
            imageUrl: "/sample_images/Picture1.jpg",
            title: "Tertiary Hospitals",
            description:
                "Comprehensive support throughout your pregnancy journey, from the first trimester to delivery.",
            hospitals: {
                imageUrl: "/sample_images/Picture1.jpg",
                title: "Charlotte Maxeke Academic Hospital",
                summary:
                    "Renowned for expert maternity services with compassionate care and advanced facilities.",
                fblink: "#",
                top3services: [
                    "Prenatal Screening",
                    "Emergency Obstetrics",
                    "Postnatal Care",
                ],
            },
        },
        {
            imageUrl: "/sample_images/Picture1.jpg",
            title: "Regional Hospitals",
            description:
                "Accessible maternal care for communities, with a focus on safe childbirth and wellness.",
            hospitals: {
                imageUrl: "/sample_images/Picture1.jpg",
                title: "Rahima Moosa Mother and Child Hospital",
                summary:
                    "Specialized care for mothers and babies, including neonatal services and high-risk pregnancy management.",
                fblink: "#",
                top3services: [
                    "High-Risk Pregnancy Care",
                    "Neonatal Services",
                    "Midwifery",
                ],
            },
        },
        {
            imageUrl: "/sample_images/Picture1.jpg",
            title: "District Hospitals",
            description:
                "Community-focused maternal health services for safe and supported childbirth.",
            hospitals: {
                imageUrl: "/sample_images/Picture1.jpg",
                title: "Edenvale Regional Hospital",
                summary:
                    "Offers community-centric maternity care with modern facilities and attentive staff.",
                fblink: "#",
                top3services: [
                    "Prenatal Care",
                    "Labour Monitoring",
                    "Postnatal Support",
                ],
            },
        },
        {
            imageUrl: "/sample_images/Picture1.jpg",
            title: "Community Health Centres (CHCs)",
            description:
                "Accessible maternal care for communities, with a focus on safe childbirth and wellness.",
            hospitals: {
                imageUrl: "/sample_images/Picture1.jpg",
                title: "Helen Joseph Hospital",
                summary:
                    "Provides personalized maternity services including prenatal and postnatal care in a supportive environment.",
                fblink: "#",
                top3services: [
                    "Prenatal Care",
                    "Postnatal Support",
                    "Counseling",
                ],
            },
        },
        {
            imageUrl: "/sample_images/Picture1.jpg",
            title: "Private Maternity Clinics",
            description:
                "Accessible maternal care for communities, with a focus on safe childbirth and wellness.",
            hospitals: {
                imageUrl: "/sample_images/Picture1.jpg",
                title: "Helen Joseph Hospital",
                summary:
                    "Provides personalized maternity services including prenatal and postnatal care in a supportive environment.",
                fblink: "#",
                top3services: [
                    "Prenatal Care",
                    "Postnatal Support",
                    "Counseling",
                ],
            },
        },
    ];

    return (
        <>
            {/* Hero Section */}
            <section
                className="position-relative text-white d-flex align-items-center justify-content-center"
                style={{ height: "80vh", overflow: "hidden" }}
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
                <div
                    className="text-center bg-darkz bg-opacity-50 p-5 rounded-4 shadow"
                    style={{ backgroundColor: "rgba(29, 65, 137, 0.5)" }}
                >
                    <h1 className="display-4 fw-bold text-white">
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
                        {/* <Link
                            to="/admin-dashboard"
                            className="button button-secondary"
                        >
                            Admin Dashboard
                        </Link> */}
                    </div>
                </div>
            </section>

            {/* Health Tip Banner */}
            <section className="bg-warning text-dark py-3 text-center health-tip-banner">
                <strong>Tip:</strong> Breastfeeding within the first hour boosts
                immunity.
            </section>

            <main>
                {/* Services Section */}
                <section id="services" className="section section-grey">
                    <div className="container my-4">
                        <h2 className="text-center">
                            Gauteng Health MCH Services
                        </h2>
                        <p></p>
                        <div className="services-grid">
                            {services.map((service) => (
                                <ServiceCard key={service.title} {...service} />
                            ))}
                        </div>

                        <hr />

                        <h5 className="text-center my-4">
                            Browse Maternal Healthcare Services by Hospital /
                            Clinic
                        </h5>
                        <p></p>
                        <div className="services-grid">
                            {perHospMaternalServices.map((inst, idx) => (
                                <LevelOfCareHospitalCard
                                    key={`${inst.title}-${idx}`}
                                    imageUrl={inst.imageUrl}
                                    title={inst.title}
                                    description={inst.description}
                                    hospitals={inst.hospitals}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="section">
                    <div className="container about-section">
                        <div className="row">
                            <div className="col-md-5 mb-4">
                                <img
                                    src={`${process.env.PUBLIC_URL}/ai_images/Designer.png`}
                                    alt="Doctor with patient"
                                    className="img-fluid"
                                    style={{
                                        borderRadius: "8px",
                                        height: "100%",
                                        objectFit: "cover",
                                        objectPosition: "center",
                                    }}
                                    onError={(e) =>
                                        (e.target.src = "/fallback.jpg")
                                    }
                                />
                            </div>
                            <div className="col-md mb-4">
                                <div>
                                    <h2>About Our Portal</h2>
                                    <p>
                                        The Maternal Child Health Portal is a
                                        digital platform designed to empower
                                        mothers and healthcare providers with
                                        the tools and information needed for a
                                        healthy pregnancy and early childhood.
                                        Our mission is to make essential health
                                        tracking simple, accessible, and secure.
                                    </p>
                                    <p>
                                        We connect patients with their care
                                        teams, provide timely reminders, and
                                        offer a wealth of educational resources.
                                    </p>
                                    <Link
                                        to="/about-us"
                                        className="button button-secondary"
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default LandingPage;
