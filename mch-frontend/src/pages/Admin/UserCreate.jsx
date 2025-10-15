import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const UserCreate = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "mother",
        hospital_id: "",
    });
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await api.get("/api/hospitals");
                setHospitals(res.data);
            } catch (err) {
                console.error("Failed to load hospitals:", err);
            }
        };

        fetchHospitals();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await api.post("/api/admin/users", form);
            navigate("/admin/users");
        } catch (err) {
            console.error("User creation failed:", err);
            setError("Failed to create user. Please check the form.");
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">Create New User</h2>

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
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={form.password}
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
                        required
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
                    Create User
                </button>
            </form>
        </div>
    );
};

export default UserCreate;
