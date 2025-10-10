import React from "react";
import services from "../data/services";
import nav from "./nav";

const ServicesGrid = () => (
    <>
        {nav()}
        <div className="services-grid container py-5">
            {services.map((service) => (
                <div key={service.id} className="service-card">
                    <img
                        src={process.env.PUBLIC_URL + service.image}
                        alt={service.title}
                    />
                    <div className="service-card-content">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </>
);

export default ServicesGrid;
