import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";

const PostnatalVisits = () => {
    const { childId } = useParams();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [formError, setFormError] = useState("");

    const [formData, setFormData] = useState({
        visit_date: new Date().toISOString().split("T")[0],
        weight: "",
        blood_pressure: "",
        temperature: "",
        notes: "",
    });

    const fetchVisits = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/children/${childId}/postnatal-visits`);
            setVisits(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError("Failed to load postnatal visits. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [childId]);

    useEffect(() => {
        fetchVisits();
    }, [fetchVisits]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        try {
            const response = await api.post(`/children/${childId}/postnatal-visits`, formData);
            setVisits([response.data.visit, ...visits]);
            setIsAdding(false);
            // Reset form
            setFormData({
                visit_date: new Date().toISOString().split("T")[0],
                weight: "",
                blood_pressure: "",
                temperature: "",
                notes: "",
            });
        } catch (err) {
            const message = err.response?.data?.message || "An error occurred while saving the visit.";
            setFormError(message);
            console.error("Failed to save visit:", err);
        }
    };

    if (loading) return <AppLoading loadingText="Loading Postnatal Visits..." />;
    if (error) return <AppLoadError errorText={error} />;

    return (
        <div className="container p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Postnatal Visits</h2>
                {!isAdding && (
                    <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                        + Add Visit
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">New Postnatal Visit</h4>
                        {formError && <div className="alert alert-danger">{formError}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Visit Date</label>
                                    <input type="date" name="visit_date" value={formData.visit_date} onChange={handleChange} className="form-control" required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Mother's Weight (kg)</label>
                                    <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className="form-control" placeholder="e.g., 65.5" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Blood Pressure</label>
                                    <input type="text" name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} className="form-control" placeholder="e.g., 120/80" />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Temperature (°C)</label>
                                    <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="form-control" placeholder="e.g., 37.2" />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Notes</label>
                                    <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" rows="3" placeholder="Any observations or notes..."></textarea>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => setIsAdding(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-success">
                                    Save Visit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    Visit History
                </div>
                {visits.length > 0 ? (
                    <ul className="list-group list-group-flush">
                        {visits.map((visit) => (
                            <li key={visit.id} className="list-group-item">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">Visit on {new Date(visit.visit_date).toLocaleDateString()}</h5>
                                    <small>ID: {visit.id}</small>
                                </div>
                                <p className="mb-1">{visit.notes || "No additional notes."}</p>
                                <small className="text-muted">
                                    Weight: {visit.weight || 'N/A'} kg | BP: {visit.blood_pressure || 'N/A'} | Temp: {visit.temperature || 'N/A'} °C
                                </small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="card-body text-center">
                        <p className="text-muted">No postnatal visits have been recorded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostnatalVisits;