import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";
import { Link, useNavigate } from "react-router-dom";

// Helper to format date for input[type=date]
const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
}

const MotherProfile = () => {
    const navigate = useNavigate();
    const [mother, setMother] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        contact: "",
        address: "",
        lastMenstrualDate: "",
    });

    // -----------------------------
    // LOAD PROFILE
    // -----------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/mother/profile");
                setMother(res.data);

                setFormData({
                    name: res.data.name || "",
                    dob: formatDateForInput(res.data.dob),
                    contact: res.data.contact_number || "",
                    address: res.data.address || "",
                    lastMenstrualDate: formatDateForInput(
                        res.data.last_menstrual_date
                    ),
                });
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Session expired. Please login again.");
                } else {
                    setError("Failed to load profile.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // -----------------------------
    // INPUT HANDLERS
    // -----------------------------
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // -----------------------------
    // SAVE CHANGES
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        setError("");
        setSuccessMessage("");

        try {
            const payload = { ...formData };
            const response = await api.put("/mother/profile", payload);

            setSuccessMessage("Profile updated successfully.");

            setMother(response.data); // Update view with fresh data from server
            setEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            const message = err.response?.data?.message || "An error occurred while saving.";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    // -----------------------------
    // UI STATES
    // -----------------------------
    if (loading) return <AppLoading loadingText="Loading profile..." />;

    if (error) {
        return (
            <div className="container py-4 text-center">
                <div className="alert alert-danger">
                    {error}
                    <br />
                    <Link className="btn btn-primary mt-3" to="/mother/login">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!mother) {
        return <AppLoadError errorText="Profile not found." />;
    }

    // -----------------------------
    // MAIN VIEW
    // -----------------------------
    return (
        <div className="container p-4">
            <h2 className="mb-4 text-center">👩🏽 Mother Profile</h2>

            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}
            {editing && error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
                {/* IMAGE */}
                <div className="col-md-4">
                    <div className="bg-secondary text-white p-4 rounded text-center">
                        Image Placeholder
                    </div>
                </div>

                {/* DETAILS */}
                <div className="col-md-8">
                    {editing ? (
                        // -----------------------------
                        // EDIT MODE
                        // -----------------------------
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Date of Birth
                                </label>
                                <input
                                    name="dob"
                                    type="date"
                                    className="form-control"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contact</label>
                                <input
                                    name="contact"
                                    type="text"
                                    className="form-control"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Last Menstrual Date
                                </label>
                                <input
                                    name="lastMenstrualDate"
                                    type="date"
                                    className="form-control"
                                    value={formData.lastMenstrualDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => {
                                    setEditing(false);
                                    setError("");
                                    setSuccessMessage("");
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        // -----------------------------
                        // VIEW MODE
                        // -----------------------------
                        <>
                            <h4>{mother.name}</h4>

                            <p>
                                <strong>Date of Birth:</strong> {mother.dob}
                            </p>
                            <p>
                                <strong>Contact:</strong> {mother.contact_number || 'N/A'}
                            </p>
                            <p>
                                <strong>Address:</strong> {mother.address || 'N/A'}
                            </p>
                            <p>
                                <strong>Last Menstrual Date:</strong> {mother.last_menstrual_date ? formatDateForInput(mother.last_menstrual_date) : 'N/A'}
                            </p>

                            <h5 className="mt-3">Children</h5>
                            {mother.children && mother.children.length > 0 ? (
                                <ul>
                                    {mother.children.map((child) => (
                                        <li key={child.id}>
                                            <strong>{child.name}</strong> — Born on {formatDateForInput(child.dob) || "N/A"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No children added yet.</p>
                            )}
                            <button className="btn btn-info mt-2" onClick={() => navigate('/mother/children')}>
                                Manage Children
                            </button>

                            <button
                                className="btn btn-warning mt-3"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MotherProfile;
