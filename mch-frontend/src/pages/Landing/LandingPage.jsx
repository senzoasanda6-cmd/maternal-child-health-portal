import React from "react";
import { Link } from "react-router-dom";
import ServiceCard from "../../components/ServiceCard.jsx";
import LevelOfCareHospitalCard from "../../components/LevelOfCareHospitalCard.jsx";
import TipRotator from "../../components/TipRotator.jsx";

import chbahImg from "../../assets/hospital_images/chbah/chbah.jpg";
import cmjahImg from "../../assets/hospital_images/cmjah/cmjah.webp";
import dgmahImg from "../../assets/hospital_images/dgmah/dgmah.jpg";
import sbahImg from "../../assets/hospital_images/sbah/sbah.jpg";

import tembisaImg from "../../assets/hospital_images/tembisa/tembisa.jpg";
import kalafongImg from "../../assets/hospital_images/kalafong/kalafong.jpg";
import helenJosephImg from "../../assets/hospital_images/helenjoseph/helenjoseph.jpg";

import rahimaImg from "../../assets/hospital_images/rahima/rahima.jpg";
import pholosongImg from "../../assets/hospital_images/pholosong/pholosong.jpg";
import sebokengImg from "../../assets/hospital_images/sebokeng/sebokeng.jpg";
import thelleImg from "../../assets/hospital_images/thelle/thelle.jpg";

import edenvaleImg from "../../assets/hospital_images/edenvale/edenvale.jpg";
import jubileeImg from "../../assets/hospital_images/jubilee/Jubilee.jpg";
import taraImg from "../../assets/hospital_images/tara/tara.jpg";
import weskoppiesImg from "../../assets/hospital_images/weskoppies/weskoppies.jpg";
import pretoriaWestImg from "../../assets/hospital_images/pretoriawest/pretoriawest.jpg";
import sizweImg from "../../assets/hospital_images/sizwe/sizwe.jpg";

// import centralImg from "../../assets/hospital_images/central.jpg";
// import tertiaryImg from "../../assets/hospital_images/tertiary.jpg";
// import regionalImg from "../../assets/hospital_images/regional.jpg";



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
            imageUrl: dgmahImg,
            title: "Central Hospitals",
            description:
                "Comprehensive support throughout your pregnancy journey, from the first trimester to delivery.",
            hospitals: [
                {
                    imageUrl: chbahImg,
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
                    imageUrl: cmjahImg,
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
                    imageUrl: dgmahImg,
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
                    imageUrl: sbahImg,
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
            imageUrl: kalafongImg,
            title: "Tertiary Hospitals",
            description:
                "Advanced maternal care for complex cases and referrals.",
            hospitals: [
                {
                    imageUrl: tembisaImg,
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
                    imageUrl: kalafongImg,
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
                    imageUrl: helenJosephImg,
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
            imageUrl: rahimaImg,
            title: "Regional Hospitals",
            description:
                "Accessible maternal care for communities, with a focus on safe childbirth and wellness.",
            hospitals: [
                {
                    imageUrl: rahimaImg,
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
                    imageUrl: pholosongImg,
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
                    imageUrl: sebokengImg,
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
                    imageUrl: thelleImg,
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
            imageUrl: pretoriaWestImg,
            title: "District Hospitals",
            description:
                "Community-focused maternal health services for safe and supported childbirth.",
            hospitals: [
                {
                    imageUrl: edenvaleImg,
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
                    imageUrl: jubileeImg,
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
                    imageUrl: pretoriaWestImg,
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
            imageUrl: sizweImg,
            title: "Specialised Hospitals",
            description:
                "Focused maternal care for specific needs including rehabilitation and tropical diseases.",
            hospitals: [
                {
                    imageUrl: sizweImg,
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
                    imageUrl: taraImg,
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
                    imageUrl: weskoppiesImg,
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

    const motherChildCareTips = [
        {
            tip: "Breastfeeding within the first hour boosts immunity.",
        },
        {
            tip: "Attend all scheduled antenatal visits to monitor your health and your baby’s development.",
        },
        {
            tip: "Take prenatal vitamins, especially folic acid, to prevent birth defects.",
        },
        {
            tip: "Skin-to-skin contact immediately after birth promotes bonding and regulates the baby’s temperature.",
        },
        {
            tip: "Exclusive breastfeeding for the first six months supports optimal growth and development.",
        },
        {
            tip: "Practice safe sleeping habits: place your baby on their back to sleep, on a firm surface.",
        },
        {
            tip: "Wash hands before handling your baby to prevent infections.",
        },
        {
            tip: "Seek help if you feel overwhelmed or anxious—maternal mental health is vital for both mother and child.",
        },
        {
            tip: "Ensure your baby receives all recommended immunizations on time.",
        },
        {
            tip: "Avoid smoking, alcohol, and drugs during pregnancy and breastfeeding.",
        },
        {
            tip: "Eat a balanced diet rich in iron, calcium, and protein during pregnancy and lactation.",
        },
        {
            tip: "Monitor fetal movements daily during the third trimester and report any decrease to your healthcare provider.",
        },
        {
            tip: "Practice kangaroo care for premature babies to improve survival and bonding.",
        },
        {
            tip: "Encourage your partner’s involvement in prenatal visits and baby care to strengthen family support.",
        },
        {
            tip: "Use mosquito nets and repellents in malaria-prone areas to protect both mother and baby.",
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

            {/* Health Tip Banner (rotating tips) */}
            <section className="bg-warning text-dark py-3 text-center health-tip-banner">
                <div className="container">
                    <TipRotator tips={motherChildCareTips.map((t) => t.tip)} />
                </div>
            </section>

            <main>
                {/* Services Section */}
                <section id="services" className="section section-grey">
                    <div className="container my-4">
                        <h2 className="text-center">
                            Gauteng Health MCH Services
                        </h2>
                        <p></p>
                        <div id="hlvServices" className="services-grid">
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
                        <div id="locServices" className="services-grid">
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

                        <hr />
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
