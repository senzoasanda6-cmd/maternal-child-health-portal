import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

const UserEdit = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "",
        hospital_id: "",
    });
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, hospitalRes] = await Promise.all([
                    api.get(`/api/admin/users/${userId}`),
                    api.get("/api/hospitals"),
                ]);
                setForm(userRes.data);
                setHospitals(hospitalRes.data);
            } catch (err) {
                console.error("Failed to load user:", err);
                setError("Unable to load user data.");
            }
        };

        fetchData();
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.put(`/api/admin/users/${userId}`, form);
            navigate("/admin/users");
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update user.");
        }
    };

    return (
        <div className="container py-4">
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

                <div className="mb-3">
                    <label className="form-label">Hospital</label>
                    <select
                        name="hospital_id"
                        className="form-select"
                        value={form.hospital_id}
                        onChange={handleChange}
                    >
                        <option value="">Select a hospital</option>
                        {hospitals.map((h) => (
                            <option key={h.id} value={h.id}>
                                {h.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">
                    Update User
                </button>
            </form>
        </div>
    );
};

export default UserEdit;
