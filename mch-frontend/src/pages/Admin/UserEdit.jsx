import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../../components/spinners/Spinner";

const UserEdit = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        facility_id: "",
    });
    const [facilities, setFacilities] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, facilityRes] = await Promise.all([
                    api.get(`/api/admin/users/${userId}`),
                    api.get("/api/admin/facilities"),
                ]);
                setForm({ ...userRes.data, password: "", password_confirmation: "" });
                setFacilities(facilityRes.data);
            } catch (err) {
                console.error("Failed to load user or facility data:", err);
                setError("Unable to load user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (form.password && form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            setSaving(false);
            return;
        }

        if (form.role === "health_worker" && !form.facility_id) {
            setError("A facility must be selected for Health Workers.");
            setSaving(false);
            return;
        }

        try {
            await api.put(`/api/admin/users/${userId}`, form);
            navigate("/admin/users");
        } catch (err) {
            console.error("Update failed:", err);
            const message = err.response?.data?.message || "Failed to update user.";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="container p-4 space-y-6">
            <h2>Edit User</h2>
            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                        name="role"
                        className="form-select"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="mother">Mother</option>
                        <option value="health_worker">Health Worker</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {form.role === "health_worker" && (
                    <div className="mb-3">
                        <label className="form-label">Facility</label>
                        <select
                            name="facility_id"
                            className="form-select"
                            value={form.facility_id || ""}
                            onChange={handleChange}
                            required={form.role === "health_worker"}
                        >
                            <option value="">Select a facility</option>
                            {facilities.map((facility) => (
                                <option key={facility.id} value={facility.id}>
                                    {facility.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <Spinner size="sm" /> : "Update User"}
                </button>
            </form>
        </div>
    );
};

export default UserEdit;
