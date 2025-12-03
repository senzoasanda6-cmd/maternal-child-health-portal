// AboutUs.js
import React from "react";

const AboutUs = () => {
    return (
        <section style={styles.container}>
            <h1 style={styles.heading}>About Us</h1>
            <p style={styles.text}>
                The <strong>Maternal and Child Health Management System</strong>{" "}
                is a digital platform designed to support healthcare delivery
                and monitoring across various levels of maternal and childcare.
            </p>
            <p style={styles.text}>
                It provides portals tailored to different user roles — from
                mothers to healthcare workers and administrators — enabling
                efficient communication, data management, and service delivery.
            </p>
        </section>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        lineHeight: "1.6",
        fontFamily: "Arial, sans-serif",
    },
    heading: {
        fontSize: "2rem",
        marginBottom: "1rem",
        color: "#2c3e50",
    },
    text: {
        fontSize: "1.1rem",
        marginBottom: "1rem",
        color: "#34495e",
    },
};

export default AboutUs;
