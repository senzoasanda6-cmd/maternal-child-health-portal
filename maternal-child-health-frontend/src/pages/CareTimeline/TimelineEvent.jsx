import React from "react";
import { useParams } from "react-router-dom";

const TimelineEvent = () => {
  const { id } = useParams();

  return (
    <div className="container py-4">
      <h2 className="mb-4">📌 Timeline Event Details</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <p><strong>Event ID:</strong> {id}</p>
          {/* Replace with event details */}
          <p className="text-muted">Event details will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;
