import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Main.css";

function AdminProfilePage() {
    const [admin, setAdmin] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", password: "" });

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        try {
            const response = await axios.get("/api/admin/profile");
            setAdmin(response.data);
            setFormData({ name: response.data.name, password: "" });
        } catch (err) {
            console.error("Failed to load profile");
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put("/api/admin/profile", formData);
            setEditing(false);
            fetchAdminProfile();
        } catch (err) {
            alert("Update failed.");
        }
    };

    if (!admin) return <p>Loading profile...</p>;

    return (
        <div className="admin-profile">
            <h2>Admin Profile</h2>
            <div className="profile-card">
                <label>Name:</label>
                {editing ? (
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />
                ) : (
                    <p>{admin.name}</p>
                )}

                <label>Email:</label>
                <p>{admin.email}</p>

                <label>Role:</label>
                <p>{admin.role}</p>

                <label>Facility:</label>
                <p>{admin.hospital_name || "N/A"}</p>

                {editing && (
                    <>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                        />
                    </>
                )}

                <div className="profile-actions">
                    {editing ? (
                        <>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
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
        </div>
    );
}

export default AdminProfilePage;
