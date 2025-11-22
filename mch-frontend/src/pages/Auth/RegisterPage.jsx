import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../components/spinners/Spinner";
import api, { csrf } from "../../services/api";
import { BsArrowLeft } from "react-icons/bs";
import { useDebounce } from "../../hooks/useDebounce"; // import debounce
import "./LoginPage.css";

/* ---------- HealthWorker Form Component ---------- */
const HealthWorkerForm = ({ form, facilities, onChange }) => (
    <div className="row g-3">
        <div className="col-md-6">
            <div className="form-floating">
                <select
                    className="form-select"
                    id="facility_id"
                    name="facility_id"
                    value={form.facility_id}
                    onChange={onChange}
                    required
                >
                    <option value="">Select Facility</option>
                    {facilities.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.name}
                        </option>
                    ))}
                </select>
                <label htmlFor="facility_id">Facility</label>
            </div>
        </div>
        <div className="col-md-6">
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="designation"
                    name="designation"
                    placeholder="Designation"
                    value={form.designation}
                    onChange={onChange}
                />
                <label htmlFor="designation">Designation</label>
            </div>
        </div>
        <div className="col-12">
            <div className="form-floating">
                <textarea
                    className="form-control"
                    id="comments"
                    name="comments"
                    placeholder="Comments"
                    value={form.comments}
                    onChange={onChange}
                    rows="3"
                />
                <label htmlFor="comments">Comments</label>
            </div>
        </div>
    </div>
);

/* ---------- Mother Form Component ---------- */
const MotherForm = ({ form, onChange }) => (
    <div className="row g-3">
        <div className="col-12">
            <div className="form-floating">
                <textarea
                    className="form-control"
                    id="comments"
                    name="comments"
                    placeholder="Additional Information"
                    value={form.comments}
                    onChange={onChange}
                    rows="3"
                />
                <label htmlFor="comments">Additional Information</label>
            </div>
        </div>
    </div>
);

function RegisterForm() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        comments: "",
        facility_id: "",
        district: "",
        designation: "",
        custom_designation: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Debounce the district input
    const debouncedDistrict = useDebounce(form.district, 500);

    /* ---------- React Query: Fetch facilities ---------- */
    const { data: facilities = [], isLoading: facilitiesLoading } = useQuery({
        queryKey: ["facilities", selectedRole, debouncedDistrict],
        queryFn: async () => {
            if (!selectedRole) return [];

            let url = `/facilities`;
            if (selectedRole === "health_worker") url += "?type=clinic";
            else if (
                (selectedRole === "manager" ||
                    selectedRole === "district_admin") &&
                debouncedDistrict
            ) {
                url += `?district=${encodeURIComponent(debouncedDistrict)}`;
            }

            const res = await api.get(url);
            return res.data;
        },
        enabled: !!selectedRole, // Only fetch when role is selected
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    /* ---------- Handlers ---------- */
    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setForm((prev) => ({ ...prev, role, district: "", facility_id: "" }));
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "facility_id") {
            const selectedFacility = facilities.find(
                (f) => f.id.toString() === value
            );
            setForm((prev) => ({
                ...prev,
                facility_id: value,
                district: selectedFacility ? selectedFacility.district : "",
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleBackToRole = () => {
        setSelectedRole("");
        setForm({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "",
            comments: "",
            facility_id: "",
            district: "",
            designation: "",
            custom_designation: "",
        });
        setError("");
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

        if (!form.facility_id) {
            setError("Facility is required.");
            setLoading(false);
            return;
        }

        const submissionData = {
            ...form,
            designation:
                form.designation === "other"
                    ? form.custom_designation
                    : form.designation,
        };

        const endpoint =
            form.role === "mother" ? "/register" : "/registration-request";

        try {
            await csrf.get("/sanctum/csrf-cookie");
            const response = await api.post(endpoint, submissionData);

            if (response.status === 200 || response.status === 201) {
                if (form.role === "mother") {
                    navigate("/dashboard");
                } else {
                    alert(
                        "Your registration request has been submitted for review. You will be notified once approved."
                    );
                    navigate("/login");
                }
            } else {
                setError(response.data.message || "Submission failed.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    /* ---------- JSX ---------- */
    return (
        <div className="login-page">
            {(loading || facilitiesLoading) && <Spinner />}
            <div className="container login-wrapper">
                {/* left side image */}
                <div className="login-left">
                    <div className="image-container">
                        <img
                            src="/mother_child_ai_2.png"
                            alt="Mother and Child"
                            className="side-image"
                        />
                        <div className="image-overlay">
                            <img
                                src="/gdoh.jpeg"
                                alt="GDOH Logo"
                                className="login-logo"
                            />
                            <h1>Maternal & Child Health Portal</h1>
                            <p>
                                Supporting healthy mothers and children through
                                technology
                            </p>
                        </div>
                    </div>
                </div>

                {/* right side form */}
                <div className="login-right" style={{ minWidth: "400px" }}>
                    <div className="login-card h-100 overflow-y-auto pt-0">
                        {!selectedRole ? (
                            <>
                                <div
                                    className="d-flex gap-2 justify-content-between align-items-center bg-white sticky-top"
                                    style={{
                                        paddingTop: "40px",
                                        paddingBottom: "20px",
                                        zIndex: "10",
                                    }}
                                >
                                    <button
                                        className="btn btn-outline-secondary btn-sm d-flex align-items-center m-0"
                                        onClick={() => navigate("/login")}
                                    >
                                        <BsArrowLeft className="me-2" />
                                        <span style={{ fontSize: "10px" }}>
                                            Have an account? Login
                                        </span>
                                    </button>
                                </div>
                                <h2>Select Your Role</h2>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        value={selectedRole}
                                        onChange={handleRoleSelect}
                                        required
                                    >
                                        <option value="">
                                            Choose a role to continue
                                        </option>
                                        <option value="mother">Mother</option>
                                        <option value="health_worker">
                                            Health Worker
                                        </option>
                                    </select>
                                    <label>Role</label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="d-flex gap-2 justify-content-between align-items-center bg-white sticky-top"
                                    style={{
                                        paddingTop: "40px",
                                        paddingBottom: "20px",
                                        zIndex: "10",
                                    }}
                                >
                                    <button
                                        className="btn btn-secondary btn-sm d-flex align-items-center m-0"
                                        onClick={handleBackToRole}
                                        style={{ maxWidth: "80px" }}
                                    >
                                        <BsArrowLeft className="me-2" />
                                        <span>Back</span>
                                    </button>
                                    <span className="badge rounded-2 bg-custom-color-primary p-2">
                                        Role:{" "}
                                        {selectedRole
                                            .replace("_", " ")
                                            .toUpperCase()}
                                    </span>
                                </div>

                                <h2>Create an Account</h2>
                                <form onSubmit={handleSubmit}>
                                    {/* Name */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Name"
                                            required
                                        />
                                        <label>Name</label>
                                    </div>

                                    {/* Email */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            required
                                        />
                                        <label>Email</label>
                                    </div>

                                    {/* Password */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                        <label>Password</label>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            required
                                        />
                                        <label>Confirm Password</label>
                                    </div>

                                    {/* Role-specific form */}
                                    {selectedRole === "health_worker" && (
                                        <HealthWorkerForm
                                            form={form}
                                            facilities={facilities}
                                            onChange={handleChange}
                                        />
                                    )}
                                    {selectedRole === "mother" && (
                                        <MotherForm
                                            form={form}
                                            onChange={handleChange}
                                        />
                                    )}

                                    {/* Errors */}
                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        Register
                                    </button>

                                    <p className="mt-3 mb-0 text-center">
                                        Already have an account?{" "}
                                        <span
                                            className="link-primary"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => navigate("/login")}
                                        >
                                            Login
                                        </span>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
