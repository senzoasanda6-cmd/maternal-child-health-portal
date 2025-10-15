import React from "react";

const LastVisitSummaryCard = ({ visit }) => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-primary text-white">Last Visit Summary</div>
      <div className="card-body">
        <p><strong>Date:</strong> {visit?.date || "N/A"}</p>
        <p><strong>Type:</strong> {visit?.type || "N/A"}</p>
        <p><strong>Notes:</strong> {visit?.notes || "No notes available."}</p>
      </div>
    </div>
  );
};

export default LastVisitSummaryCard;
