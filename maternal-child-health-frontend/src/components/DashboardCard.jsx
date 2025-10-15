// src/components/DashboardCard.jsx
import React from "react";

const DashboardCard = ({ title, value, icon, link }) => {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{title}</h5>
          <p className="card-text fs-4 fw-bold">{value}</p>
        </div>
        {icon && <div className="fs-2">{icon}</div>}
      </div>
      {link && (
        <div className="card-footer text-end">
          <a href={link} className="btn btn-sm btn-outline-primary">
            View Details
          </a>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
