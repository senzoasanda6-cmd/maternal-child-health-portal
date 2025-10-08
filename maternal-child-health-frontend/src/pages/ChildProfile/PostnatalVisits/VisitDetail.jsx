import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VisitDetail = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await axios.get(`/api/postnatal-visits/${id}`);
        setVisit(response.data);
      } catch (err) {
        setError("Failed to load visit details.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [id]);

  if (loading) return <div className="container py-4">Loading visit details...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;
  if (!visit) return null;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Visit Details</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Visit Date: {visit.visit_date}</h5>
          <p><strong>Child:</strong> {visit.child_name || "N/A"}</p>
          <p><strong>Visit Type:</strong> {visit.type || "Routine Checkup"}</p>
          <p><strong>Notes:</strong> {visit.notes || "No notes provided."}</p>
          <p><strong>Recorded By:</strong> {visit.recorded_by || "Unknown"}</p>
        </div>
      </div>
    </div>
  );
};

export default VisitDetail;
