import React from "react";
import { Row, Col } from "react-bootstrap";

const AppointmentStatsCard = ({ stats = {} }) => {
  const statItems = [
    {
      label: "Today",
      value: stats.today || 0,
      icon: "📍",
      color: "bg-info",
    },
    {
      label: "Upcoming",
      value: stats.upcoming || 0,
      icon: "📅",
      color: "bg-primary",
    },
    {
      label: "Confirmed",
      value: stats.confirmed || 0,
      icon: "✅",
      color: "bg-success",
    },
    {
      label: "Pending",
      value: stats.pending || 0,
      icon: "⏳",
      color: "bg-warning",
    },
    {
      label: "Overdue",
      value: stats.overdue || 0,
      icon: "⚠️",
      color: "bg-danger",
    },
  ];

  return (
    <div className="mb-4">
      <Row className="g-3">
        {statItems.map((stat, index) => (
          <Col md={6} lg={2.4} key={index}>
            <div className={`card text-white ${stat.color}`}>
              <div className="card-body text-center">
                <div className="fs-3 mb-2">{stat.icon}</div>
                <div className="fs-2 fw-bold">{stat.value}</div>
                <div className="small">{stat.label}</div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AppointmentStatsCard;
