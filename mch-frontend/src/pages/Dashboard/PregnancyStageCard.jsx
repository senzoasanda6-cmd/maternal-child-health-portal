import React from "react";

const PregnancyStageCard = ({ stage }) => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-success text-white">Pregnancy Stage</div>
      <div className="card-body">
        <h5>{stage?.title || "Stage not set"}</h5>
        <p>{stage?.description || "No description available."}</p>
      </div>
    </div>
  );
};

export default PregnancyStageCard;
