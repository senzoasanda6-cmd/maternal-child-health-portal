import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";
import { Link, useNavigate } from "react-router-dom";

const formatDate = (dateString) => (dateString ? dateString.split("T")[0] : "");
const isDateField = (key) =>
    key.toLowerCase().includes("date") || key.toLowerCase().includes("dob");

const FIELD_CONFIG = {
    district_id: { label: "District", type: "select" },
    contact_number: { label: "Primary Contact", type: "text" },
    name: { label: "Full Name", type: "text" },
    email: { label: "Email Address", type: "email" },
    phone: { label: "Phone Number", type: "text" },
    dob: { label: "Date of Birth", type: "date" },
    address: { label: "Residential Address", type: "text" },
    last_menstrual_date: { label: "Last Menstrual Date", type: "date" },
    trimester: { label: "Current Trimester", type: "select", readOnly: true },
};

const MotherProfile = () => {
    const navigate = useNavigate();
    const [mother, setMother] = useState(null);
    const [formData, setFormData] = useState({});
    const [children, setChildren] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const loadProfileAndDistricts = async () => {
            try {
                const [profileRes, facilitiesRes] = await Promise.all([
                    api.get("/mother/profile"),
                    api.get("/facilities"),
                ]);

                const profile = profileRes.data;
                setMother(profile);
                setChildren(profile.children || []);

                // Build formData
                const initialFormData = Object.keys(FIELD_CONFIG).reduce(
                    (acc, key) => {
                        acc[key] = profile[key] || "";
                        return acc;
                    },
                    {}
                );
                setFormData(initialFormData);

                // Extract unique districts
                const facilities = facilitiesRes.data || [];
                const uniqueDistricts = [
                    ...new Map(
                        facilities
                            .filter((f) => f.district)
                            .map((f) => [f.district.id, f.district])
                    ).values(),
                ];
                setDistricts(uniqueDistricts);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                        "Failed to load profile/facilities"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfileAndDistricts();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccessMessage("");

        try {
            const payload = { ...formData };
            delete payload.trimester; // backend calculates trimester

            const res = await api.put("/mother/profile", payload);
            setMother(res.data);
            setChildren(res.data.children || []);
            setSuccessMessage("Profile updated successfully.");
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AppLoading loadingText="Loading profile..." />;

    if (error && !mother) {
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

    if (!mother) return <AppLoadError errorText="Profile not found." />;

    return (
        <div className="container p-4">
            <h2 className="mb-4 text-center">👩🏽 Mother Profile</h2>
            {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
            )}

            <div className="card">
                <div className="card-body">
                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            {Object.entries(FIELD_CONFIG).map(
                                ([key, config]) => (
                                    <div className="mb-3" key={key}>
                                        <label className="form-label">
                                            {config.label}
                                        </label>

                                        {key === "district_id" ? (
                                            <select
                                                name="district_id"
                                                className="form-select"
                                                value={
                                                    formData.district_id || ""
                                                }
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Select District
                                                </option>
                                                {districts.map((d) => (
                                                    <option
                                                        key={d.id}
                                                        value={d.id}
                                                    >
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : config.type === "select" ? (
                                            <select
                                                name={key}
                                                className="form-select"
                                                value={formData[key]}
                                                onChange={handleChange}
                                                disabled={config.readOnly}
                                            >
                                                <option value="">
                                                    Select Trimester
                                                </option>
                                                <option value="1">First</option>
                                                <option value="2">
                                                    Second
                                                </option>
                                                <option value="3">Third</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={config.type}
                                                name={key}
                                                className="form-control"
                                                value={formData[key]}
                                                onChange={handleChange}
                                                readOnly={config.readOnly}
                                            />
                                        )}
                                    </div>
                                )
                            )}

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
                        <>
                            <h4>{mother.name}</h4>

                            {Object.entries(FIELD_CONFIG).map(
                                ([key, config]) => {
                                    let value = mother[key];
                                    if (key === "district_id") {
                                        value = mother.district?.name || "N/A";
                                    } else if (isDateField(key)) {
                                        value = formatDate(value);
                                    }
                                    return (
                                        <p key={key}>
                                            <strong>{config.label}: </strong>
                                            {value || "N/A"}
                                        </p>
                                    );
                                }
                            )}

                            <h5 className="mt-3">Children</h5>
                            {children.length > 0 ? (
                                <ul>
                                    {children.map((c) => (
                                        <li key={c.id}>
                                            <strong>{c.name}</strong> — Born on{" "}
                                            {formatDate(c.dob)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No children added yet.</p>
                            )}

                            <button
                                className="btn btn-info mt-2"
                                onClick={() => navigate("/mother/children")}
                            >
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
