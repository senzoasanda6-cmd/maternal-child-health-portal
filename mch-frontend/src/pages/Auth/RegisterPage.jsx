import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinners/Spinner";
import axios from "axios"; // Import axios
import { BsArrowLeft } from "react-icons/bs";
import "./LoginPage.css";

function RegisterForm() {
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        hospital_id: "",
        comments: "",
        facility_id: "",
        district: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [facilities, setFacilities] = useState([]);

    // Base URL of your backend API
    const API_BASE = "http://localhost:8000";

    // Configure axios to include credentials (cookies) with every request
    axios.defaults.withCredentials = true;
    axios.defaults.withXSRFToken = true;

    useEffect(() => {
        if (!selectedRole) return;

        let url = `${API_BASE}/api/facilities`;

        if (selectedRole === "health_worker") {
            url += "?type=clinic";
        } else if (
            (selectedRole === "manager" || selectedRole === "district_admin") &&
            form.district
        ) {
            url += `?district=${encodeURIComponent(form.district)}`;
        }

        console.log("Fetching facilities from:", url);

        axios.get(url)
            .then((data) => {
                console.log("Facilities fetched:", data.data);
                setFacilities(data.data);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setFacilities([]);
            });
    }, [selectedRole, form.district]);

    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setForm((prev) => ({ ...prev, role, district: "", facility_id: "" }));
        setFacilities([]); // Reset facilities when role changes
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Reset facility if district changes to avoid stale selection
        if (name === "district") {
            setForm((prev) => ({ ...prev, facility_id: "" }));
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
            hospital_id: "",
            comments: "",
            facility_id: "",
            district: "",
        });
        setError("");
        setFacilities([]);
    };

    const getCsrfCookie = async () => {
        await axios.get(`${API_BASE}/sanctum/csrf-cookie`);
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

        if (form.role !== "mother" && !form.facility_id) {
            setError("Facility is required for this role.");
            setLoading(false);
            return;
        }

        const endpoint =
            form.role === "mother"
                ? `${API_BASE}/api/register` 
                : `${API_BASE}/api/registration-request`;

        try {
            // Get CSRF cookie before POST request (Laravel Sanctum)
            await getCsrfCookie();

            const response = await axios.post(endpoint, form);

            if (response.status === 200 || response.status === 201) {
                 if (form.role === "mother") {
                    navigate("/dashboard");
                } else {
                    alert(
                        "Your registration request has been submitted for review."
                    );
                    navigate("/login");
                }
            } else {
                setError(response.data.message || "Submission failed.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {loading && <Spinner />}
            <div className="container login-wrapper">
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

                <div className="login-right">
                    <div className="login-card">
                        {!selectedRole ? (
                            <>
                                <h2>Select Your Role</h2>
                                <div className="form-floating mb-3">
                                    <select
                                        className="form-select"
                                        id="floatingRoleSelect"
                                        value={selectedRole}
                                        onChange={handleRoleSelect}
                                        required
                                    >
                                        <option value="">
                                            Choose a role to continue
                                        </option>
                                        <option value="mother">Mother</option>
                                        <option value="child">Child</option>
                                        <option value="health_worker">
                                            Health Worker
                                        </option>
                                        <option value="manager">Manager</option>
                                        <option value="clinical_manager">
                                            Clinical Manager
                                        </option>
                                        <option value="district_admin">
                                            District Admin
                                        </option>
                                    </select>
                                    <label htmlFor="floatingRoleSelect">
                                        Role
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <button
                                        className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                                        onClick={handleBackToRole}
                                        type="button"
                                    >
                                        <BsArrowLeft className="me-2" />
                                        <span>Back</span>
                                    </button>
                                    <span className="badge rounded-pill bg-primary">
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
                                            id="floatingName"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Name"
                                            required
                                        />
                                        <label htmlFor="floatingName">
                                            Name
                                        </label>
                                    </div>

                                    {/* Email */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="floatingEmail"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email"
                                            required
                                        />
                                        <label htmlFor="floatingEmail">
                                            Email
                                        </label>
                                    </div>

                                    {/* Password */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingPassword"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            required
                                        />
                                        <label htmlFor="floatingPassword">
                                            Password
                                        </label>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="floatingConfirmPassword"
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            required
                                        />
                                        <label htmlFor="floatingConfirmPassword">
                                            Confirm Password
                                        </label>
                                    </div>

                                    {/* District input for manager and district_admin */}
                                    {(form.role === "district_admin" ||
                                        form.role === "manager") && (
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="floatingDistrict"
                                                name="district"
                                                value={form.district || ""}
                                                onChange={handleChange}
                                                placeholder="District"
                                                required
                                            />
                                            <label htmlFor="floatingDistrict">
                                                District
                                            </label>
                                        </div>
                                    )}

                                    {/* Facility Dropdown for non-mother roles */}
                                    {form.role !== "mother" && (
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                id="floatingFacility"
                                                name="facility_id"
                                                value={form.facility_id}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Facility
                                                </option>
                                                {facilities.map((facility) => (
                                                    <option
                                                        key={facility.id}
                                                        value={facility.id}
                                                    >
                                                        {facility.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="floatingFacility">
                                                Facility
                                            </label>
                                        </div>
                                    )}

                                    {/* Registration Info & Errors */}
                                    {form.role !== "mother" && (
                                        <div className="alert alert-info">
                                            Your registration will be reviewed
                                            by an administrator before approval.
                                        </div>
                                    )}

                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
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
