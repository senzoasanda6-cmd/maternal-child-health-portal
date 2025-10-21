import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../Main.css";
import Spinner from "../../components/spinners/Spinner";

function AdminProfilePage() {
    const [admin, setAdmin] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/api/admin/profile");
            setAdmin(response.data);
            setFormData({ name: response.data.name, password: "" });
        } catch (err) {
            console.error("Failed to load profile:", err);
            setError("Failed to load profile. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        setError("");
        try {
            await api.put("/api/admin/profile", formData);
            setEditing(false);
            fetchAdminProfile();
        } catch (err) {
            console.error("Update failed:", err);
            alert("Update failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;
    if (!admin) return <p className="text-center">Profile not found.</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Admin Profile</h2>
            <div className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Name:</label>
                    {editing ? (
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    ) : (
                        <p className="form-control-plaintext">{admin.name}</p>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <p className="form-control-plaintext">{admin.email}</p>
                </div>

                <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <p className="form-control-plaintext">{admin.role}</p>
                </div>

                <div className="mb-3">
                    <label className="form-label">Facility:</label>
                    <p className="form-control-plaintext">
                        {admin.hospital_name || "N/A"}
                    </p>
                </div>

                {editing ? (
                    <>
                        <div className="mb-3">
                            <label className="form-label">New Password (optional):</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </div>
                        <div className="profile-actions">
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdate}
                                disabled={saving}
                            >
                                {saving ? <Spinner size="sm" /> : "Save Changes"}
                            </button>
                            <button
                                className="btn btn-secondary ms-2"
                                onClick={() => setEditing(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}

export default AdminProfilePage;
