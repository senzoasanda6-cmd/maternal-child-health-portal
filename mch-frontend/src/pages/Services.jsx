import React from "react";
import services from "../data/services";

function Services() {
  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <div className="services-grid">
        {services.map(({ id, title, description, image }) => (
          <div key={id} className="service-card">
            <img src={image} alt={title} className="service-image" />
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;

