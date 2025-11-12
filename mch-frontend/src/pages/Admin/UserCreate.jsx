import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Spinner from "../../components/spinners/Spinner";

const UserCreate = () => {
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
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get("/admin/facilities")
            .then((res) => setFacilities(res.data))
            .catch((err) => console.error("Failed to load facilities:", err));
    }, []);
    useEffect(() => {
        if (form.role !== "health_worker") {
            setForm((prev) => ({ ...prev, facility_id: "" }));
        }
    }, [form.role]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match.");
            setSaving(false);
            return;
        }

        if (!form.facility_id) {
            setError("A facility must be selected.");
            setSaving(false);
            return;
        }

        try {
            await api.post("/admin/users", form);
            navigate("/admin/users");
        } catch (err) {
            console.error("User creation failed:", err);
            const message =
                err.response?.data?.message || "Failed to create user.";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container p-4 space-y-6">
            <h2 className="text-custom-color-primary fw-bold">Create New User</h2>
            <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => navigate("/admin/users")}
            >
                ← Back to User List
            </button>

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
                        required
                    >
                        <option value="">Select a role</option>
                        <option value="mother">Mother</option>
                        <option value="health_worker">Health Worker</option>
                        <option value="admin">Admin</option>
                        <option value="dstrict_admin">District Admin</option>
                        <option value="hospital_admin">Hospital Admin</option>
                        <option value="facility_admin">Facility Admin</option>
                        <option value="facility_manager">
                            Facility Manager
                        </option>
                        <option value="facility_worker">Facility Worker</option>
                        <option value="facility_nurse">Facility Nurse</option>
                        <option value="facility_doctor">Facility Doctor</option>
                        <option value="midwife">Midwife</option>
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
                            required
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
                <div className="mb-3">
                    <label className="form-label">Facility</label>
                    <select
                        name="facility_id"
                        className="form-select"
                        value={form.facility_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a facility</option>
                        {facilities.map((facility) => (
                            <option key={facility.id} value={facility.id}>
                                {facility.name}
                            </option>
                        ))}
                    </select>
                </div>
                {form.facility_id && (
                    <div className="mt-2 p-3 border rounded bg-light">
                        <strong>Selected Facility Details:</strong>
                        <div>
                            <strong>Name:</strong>{" "}
                            {
                                facilities.find(
                                    (f) => f.id === Number(form.facility_id)
                                )?.name
                            }
                        </div>
                        <div>
                            <strong>Type:</strong>{" "}
                            {facilities.find(
                                (f) => f.id === Number(form.facility_id)
                            )?.type || "N/A"}
                        </div>
                        <div>
                            <strong>District:</strong>{" "}
                            {facilities.find(
                                (f) => f.id === Number(form.facility_id)
                            )?.district || "N/A"}
                        </div>
                        <div>
                            <strong>Sub-District:</strong>{" "}
                            {facilities.find(
                                (f) => f.id === Number(form.facility_id)
                            )?.sub_district || "N/A"}
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? <Spinner size="sm" /> : "Create User"}
                </button>
            </form>
        </div>
    );
};

export default UserCreate;
