import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VisitEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    visit_date: "",
    type: "",
    notes: "",
  });

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await axios.get(`/api/postnatal-visits/${id}`);
        setVisit(response.data);
        setFormData({
          visit_date: response.data.visit_date,
          type: response.data.type || "",
          notes: response.data.notes || "",
        });
      } catch (err) {
        setError("Failed to load visit.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/postnatal-visits/${id}`, formData);
      navigate(`/visit/${id}`);
    } catch (err) {
      setError("Failed to update visit.");
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Edit Visit</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            name="visit_date"
            className="form-control"
            value={formData.visit_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Visit Type</label>
          <input
            type="text"
            name="type"
            className="form-control"
            value={formData.type}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Notes</label>
          <textarea
            name="notes"
            className="form-control"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default VisitEdit;
