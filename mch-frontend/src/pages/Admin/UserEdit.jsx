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
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedSubDistrict, setSelectedSubDistrict] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, facilityRes] = await Promise.all([
                    api.get(`/admin/users/${userId}`),
                    api.get("/admin/facilities"),
                ]);
                setForm({
                    ...userRes.data,
                    password: "",
                    password_confirmation: "",
                });
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

    useEffect(() => {
        setSelectedDistrict("");
        setSelectedSubDistrict("");
    }, [form.role]);

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
            await api.put(`/admin/users/${userId}`, form);
            navigate("/admin/users");
        } catch (err) {
            console.error("Update failed:", err);
            const message =
                err.response?.data?.message || "Failed to update user.";
            setError(message);
        } finally {
            setSaving(false);
        }
    };

    const districts = [
        ...new Set(facilities.map((f) => f.district).filter(Boolean)),
    ];

    const subDistricts = [
        ...new Set(
            facilities
                .filter(
                    (f) => !selectedDistrict || f.district === selectedDistrict
                )
                .map((f) => f.sub_district)
                .filter(Boolean)
        ),
    ];

    const filteredFacilities = facilities.filter((f) => {
        return (
            (!selectedDistrict || f.district === selectedDistrict) &&
            (!selectedSubDistrict || f.sub_district === selectedSubDistrict)
        );
    });

    if (loading) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="container p-4 space-y-6">
            <h2 className="text-custom-color-primary fw-bold">Edit User</h2>
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
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current password"
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            autoComplete="new-password"
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

                {/* Facility Selection for ALL Roles */}
                <div className="mb-3">
                    <label className="form-label">
                        {form.role === "health_worker"
                            ? "Assigned Facility (Required)"
                            : "Facility (Recommended)"}
                    </label>
                    <select
                        name="facility_id"
                        className="form-select"
                        value={form.facility_id || ""}
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedFacility = facilities.find(
                                (f) => f.id === selectedId
                            );
                            setForm({
                                ...form,
                                facility_id: selectedId,
                            });
                            if (selectedFacility) {
                                setSelectedDistrict(
                                    selectedFacility.district || ""
                                );
                                setSelectedSubDistrict(
                                    selectedFacility.sub_district || ""
                                );
                            }
                        }}
                    >
                        <option value="">Select a facility</option>
                        {filteredFacilities.map((facility) => (
                            <option key={facility.id} value={facility.id}>
                                {facility.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filters: Only shown when facilities exist */}
                {facilities.length > 0 && (
                    <div className="row mb-3 align-items-end">
                        <div className="col-md-5">
                            <label className="form-label">
                                Filter by District
                            </label>
                            <select
                                className="form-select"
                                value={selectedDistrict}
                                onChange={(e) => {
                                    setSelectedDistrict(e.target.value);
                                    setSelectedSubDistrict("");
                                }}
                            >
                                <option value="">All Districts</option>
                                {districts.map((d, i) => (
                                    <option key={i} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-5">
                            <label className="form-label">
                                Filter by Sub-District
                            </label>
                            <select
                                className="form-select"
                                value={selectedSubDistrict}
                                onChange={(e) =>
                                    setSelectedSubDistrict(e.target.value)
                                }
                            >
                                <option value="">All Sub-Districts</option>
                                {subDistricts.map((sd, i) => (
                                    <option key={i} value={sd}>
                                        {sd}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSelectedDistrict("");
                                    setSelectedSubDistrict("");
                                    setForm((prev) => ({
                                        ...prev,
                                        facility_id: "",
                                    }));
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? <Spinner size="sm" /> : "Update User"}
                </button>
            </form>
        </div>
    );
};

export default UserEdit;
