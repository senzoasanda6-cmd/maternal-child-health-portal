import React from "react";
import "./EmergencyResources.css";
import Header from "./Header";

const emergencyContacts = [
    {
        label: "Police Emergency Services",
        number: "10111",
    },
    {
        label: "Ambulance & Fire Brigade",
        number: "10177",
    },
    {
        label: "National Emergency Line (mobile)",
        number: "112",
    },
    {
        label: "ER24 Medical Services",
        number: "084124",
    },
    {
        label: "Netcare 911",
        number: "082911",
    },
    {
        label: "GBV Command Centre",
        number: "0800428428",
    },
    {
        label: "Childline South Africa",
        number: "0800055555",
    },
    {
        label: "Human Trafficking Helpline",
        number: "08000737283",
    },
];

export default function EmergencyResources() {
    return (
        <>
            <Header />
            <div className="er-container">
                <h1 className="er-title"> Emergency Support for Mothers</h1>
                <p className="er-intro">
                    If you or someone you know is in danger, needs urgent
                    medical help, or is facing abuse, these services are
                    available 24/7 across South Africa.
                </p>

                <div className="er-list">
                    {emergencyContacts.map((contact, index) => (
                        <div key={index} className="er-card">
                            <h2>{contact.label}</h2>
                            <a
                                href={`tel:${contact.number}`}
                                className="er-call-button"
                            >
                                Call {contact.number}
                            </a>
                        </div>
                    ))}
                </div>

                <p className="er-footer">
                    You are not alone. Help is just a call away. Save these
                    numbers and share them with others who may need support.
                </p>
            </div>
        </>
    );
}
