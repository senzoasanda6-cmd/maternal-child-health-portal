import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinners/Spinner";

const UserCreate = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "mother",
        facility_id: "",
    });
    const [facilities, setFacilities] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await api.get("/api/admin/facilities");
                setFacilities(res.data);
            } catch (err) {
                console.error("Failed to load facilities:", err);
                setError("Failed to load facility data.");
            }
        };

        fetchHospitals();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (form.role === "health_worker" && !form.facility_id) {
            setError("A facility must be selected for Health Workers.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/api/admin/users", form);
            navigate("/admin/users");
        } catch (err) {
            console.error("User creation failed:", err);
            const message = err.response?.data?.message || "Failed to create user. Please check the form.";
            setError(message);
        } finally {
            setLoading(false);
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

                <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
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
                            value={form.facility_id}
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Create User"}
                </button>
            </form>
        </div>
    );
};

export default UserCreate;
