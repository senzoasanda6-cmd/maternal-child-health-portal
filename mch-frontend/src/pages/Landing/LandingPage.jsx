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
            imageUrl: "/hospital_images/central.jpg",
            title: "Central Hospitals",
            description:
                "Comprehensive support throughout your pregnancy journey, from the first trimester to delivery.",
            hospitals: [
                {
                    imageUrl: "/hospital_images/chbah/chbah.jpg",
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
                {
                    imageUrl: "/hospital_images/cmjah/cmjah.jpg",
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
                {
                    imageUrl: "/hospital_images/dgmah/dgmah.jpg",
                    title: "Dr George Mukhari Academic Hospital",
                    summary:
                        "Provides high-level maternal care including neonatal ICU and specialist obstetric services.",
                    fblink: "#",
                    top3services: [
                        "High-Risk Pregnancy",
                        "Neonatal ICU",
                        "Obstetric Surgery",
                    ],
                },
                {
                    imageUrl: "/hospital_images/sbah/sbah.jpg",
                    title: "Steve Biko Academic Hospital",
                    summary:
                        "Advanced maternal care with a focus on critical cases and research-based practices.",
                    fblink: "#",
                    top3services: [
                        "Maternal ICU",
                        "Obstetric Emergencies",
                        "Postnatal Monitoring",
                    ],
                },
            ],
        },
        {
            imageUrl: "/hospital_images/tertiary.jpg",
            title: "Tertiary Hospitals",
            description:
                "Advanced maternal care for complex cases and referrals.",
            hospitals: [
                {
                    imageUrl: "/hospital_images/tembisa/tembisa.jpg",
                    title: "Tembisa Hospital",
                    summary:
                        "Offers full-spectrum maternity services including emergency obstetrics and neonatal care.",
                    fblink: "#",
                    top3services: [
                        "Emergency Obstetrics",
                        "Prenatal Care",
                        "Neonatal Services",
                    ],
                },
                {
                    imageUrl: "/hospital_images/kalafong/kalafong.jpg",
                    title: "Kalafong Hospital",
                    summary:
                        "Provides maternal care with a focus on community outreach and education.",
                    fblink: "#",
                    top3services: [
                        "Prenatal Education",
                        "Labour Support",
                        "Postnatal Counseling",
                    ],
                },
                {
                    imageUrl: "/hospital_images/helenjoseph/helenjoseph.jpg",
                    title: "Helen Joseph Hospital",
                    summary:
                        "Personalized maternity services including prenatal and postnatal care.",
                    fblink: "#",
                    top3services: [
                        "Prenatal Care",
                        "Postnatal Support",
                        "Counseling",
                    ],
                },
            ],
        },
        {
            imageUrl: "/hospital_images/regional.jpg",
            title: "Regional Hospitals",
            description:
                "Accessible maternal care for communities, with a focus on safe childbirth and wellness.",
            hospitals: [
                {
                    imageUrl: "/hospital_images/rahima/rahima.jpg",
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
                {
                    imageUrl: "/hospital_images/pholosong/pholosong.jpg",
                    title: "Pholosong Hospital",
                    summary:
                        "Community-focused maternal care with emergency obstetric services.",
                    fblink: "#",
                    top3services: [
                        "Prenatal Care",
                        "Emergency Obstetrics",
                        "Postnatal Support",
                    ],
                },
                {
                    imageUrl: "/hospital_images/sebokeng/sebokeng.jpg",
                    title: "Sebokeng Hospital",
                    summary:
                        "Provides maternal services with a focus on safe delivery and newborn care.",
                    fblink: "#",
                    top3services: [
                        "Labour Monitoring",
                        "Newborn Care",
                        "Postnatal Support",
                    ],
                },
                {
                    imageUrl: "/hospital_images/thelle/thelle.jpg",
                    title: "Thelle Mogoerane Hospital",
                    summary:
                        "Offers full maternity services including antenatal clinics and delivery units.",
                    fblink: "#",
                    top3services: [
                        "Antenatal Clinics",
                        "Labour & Delivery",
                        "Postnatal Care",
                    ],
                },
            ],
        },
        {
            imageUrl: "/hospital_images/district.jpg",
            title: "District Hospitals",
            description:
                "Community-focused maternal health services for safe and supported childbirth.",
            hospitals: [
                {
                    imageUrl: "/hospital_images/edenvale/edenvale.jpg",
                    title: "Edenvale Hospital",
                    summary:
                        "Offers community-centric maternity care with modern facilities and attentive staff.",
                    fblink: "#",
                    top3services: [
                        "Prenatal Care",
                        "Labour Monitoring",
                        "Postnatal Support",
                    ],
                },
                {
                    imageUrl: "/hospital_images/jubilee/jubilee.jpg",
                    title: "Jubilee District Hospital",
                    summary:
                        "Provides maternal services including antenatal care and delivery support.",
                    fblink: "#",
                    top3services: [
                        "Antenatal Care",
                        "Delivery Support",
                        "Postnatal Services",
                    ],
                },
                {
                    imageUrl: "/hospital_images/pretoriawest/pretoriawest.jpg",
                    title: "Pretoria West District Hospital",
                    summary:
                        "Supports maternal health with a focus on safe delivery and community outreach.",
                    fblink: "#",
                    top3services: [
                        "Prenatal Care",
                        "Safe Delivery",
                        "Community Education",
                    ],
                },
            ],
        },
        {
            imageUrl: "/hospital_images/specialised.jpg",
            title: "Specialised Hospitals",
            description:
                "Focused maternal care for specific needs including rehabilitation and tropical diseases.",
            hospitals: [
                {
                    imageUrl: "/hospital_images/sizwe/sizwe.jpg",
                    title: "Sizwe Tropical Disease Hospital",
                    summary:
                        "Provides maternal care in the context of infectious disease management.",
                    fblink: "#",
                    top3services: [
                        "Prenatal Screening",
                        "Infectious Disease Management",
                        "Postnatal Support",
                    ],
                },
                {
                    imageUrl: "/hospital_images/tara/tara.jpg",
                    title: "Tara The H Moross Centre",
                    summary:
                        "Offers psychiatric support for mothers during and after pregnancy.",
                    fblink: "#",
                    top3services: [
                        "Mental Health Support",
                        "Prenatal Counseling",
                        "Postpartum Care",
                    ],
                },
                {
                    imageUrl: "/hospital_images/weskoppies/weskoppies.jpg",
                    title: "Weskoppies Psychiatric Hospital",
                    summary:
                        "Specialized psychiatric care for maternal mental health.",
                    fblink: "#",
                    top3services: [
                        "Psychiatric Evaluation",
                        "Prenatal Counseling",
                        "Postnatal Therapy",
                    ],
                },
            ],
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
