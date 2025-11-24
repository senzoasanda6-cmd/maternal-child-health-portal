import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AppLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";
import { Link } from "react-router-dom";

const normalizeChildren = (children) => {
    if (!Array.isArray(children)) return [];

    return children.map((child) => {
        if (typeof child === "string") {
            return { name: child, dob: "" };
        }
        return {
            name: child.name || "",
            dob: child.dob || "",
        };
    });
};

const MotherProfile = () => {
    const [mother, setMother] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        contact: "",
        address: "",
        children: [],
    });

    // -----------------------------
    // LOAD PROFILE
    // -----------------------------
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/mother/profile");

                const normalizedChildren = normalizeChildren(res.data.children);

                setMother({ ...res.data, children: normalizedChildren });

                setFormData({
                    name: res.data.name || "",
                    dob: res.data.dob || "",
                    contact: res.data.contact || "",
                    address: res.data.address || "",
                    children: normalizedChildren,
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

    const handleChildChange = (index, field, value) => {
        const updatedChildren = [...formData.children];
        updatedChildren[index] = { ...updatedChildren[index], [field]: value };

        setFormData((prev) => ({ ...prev, children: updatedChildren }));
    };

    // -----------------------------
    // SAVE CHANGES
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = { ...formData };
            await api.put("/mother/profile", payload);

            alert("Profile updated successfully.");

            setMother(payload);
            setEditing(false);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Something went wrong.");
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
                    <Link className="btn btn-primary mt-3" to="/login">
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

                            {/* CHILDREN EDIT SECTION */}
                            <div className="mb-3">
                                <label className="form-label">Children</label>
                                {(formData.children || []).map(
                                    (child, index) => (
                                        <div
                                            key={index}
                                            className="border p-2 rounded mb-3"
                                        >
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={child.name}
                                                onChange={(e) =>
                                                    handleChildChange(
                                                        index,
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={child.dob}
                                                onChange={(e) =>
                                                    handleChildChange(
                                                        index,
                                                        "dob",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )
                                )}
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
                                onClick={() => setEditing(false)}
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
                                <strong>Contact:</strong> {mother.contact}
                            </p>
                            <p>
                                <strong>Address:</strong> {mother.address}
                            </p>

                            <h5 className="mt-3">Children</h5>
                            <ul>
                                {(mother.children || []).map((child, index) => (
                                    <li key={index}>
                                        <strong>{child.name}</strong> —{" "}
                                        {child.dob || "N/A"}
                                    </li>
                                ))}
                            </ul>

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
