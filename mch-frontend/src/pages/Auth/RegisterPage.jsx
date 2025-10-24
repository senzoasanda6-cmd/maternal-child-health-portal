import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/spinners/Spinner";
import axios from "axios";
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
        comments: "",
        facility_id: "",
        district: "",
        designation: "", 
        custom_designation: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [facilities, setFacilities] = useState([]);

    const API_BASE = "http://localhost:8000";

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

        axios
            .get(url)
            .then((data) => {
                setFacilities(data.data);
            })
            .catch(() => {
                setFacilities([]);
            });
    }, [selectedRole, form.district]);

    const handleRoleSelect = (e) => {
        const role = e.target.value;
        setSelectedRole(role);
        setForm((prev) => ({
            ...prev,
            role,
            district: "",
            facility_id: "",
        }));
        setFacilities([]);
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "facility_id") {
            const selectedFacility = facilities.find(
                (facility) => facility.id.toString() === value
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

    if (!form.facility_id) {
        setError("Facility is required.");
        setLoading(false);
        return;
    }

    // Adjust designation if "other" is selected
    const submissionData = {
        ...form,
        designation:
            form.designation === "other"
                ? form.custom_designation
                : form.designation,
    };

    const endpoint =
        form.role === "mother"
            ? `${API_BASE}/api/register`
            : `${API_BASE}/api/registration-request`;

    try {
        await getCsrfCookie();

        const response = await axios.post(endpoint, submissionData);

        if (response.status === 200 || response.status === 201) {
            if (form.role === "mother") {
                navigate("/dashboard");
            } else {
                alert("Your registration request has been submitted for review.");
                navigate("/login");
            }
        } else {
            setError(response.data.message || "Submission failed.");
        }
    } catch (err) {
        const errorMessage =
            err.response?.data?.message ||
            "An error occurred. Please try again.";
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
                                        type="button"
                                    >
                                        <BsArrowLeft className="me-2" />
                                        <span
                                            className="flex-fill"
                                            style={{ fontSize: "10px" }}
                                        >
                                            Have an account? Login
                                        </span>
                                    </button>
                                </div>
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

                                        <option value="health_worker">
                                            Health Worker
                                        </option>
                                    </select>
                                    <label htmlFor="floatingRoleSelect">
                                        Role
                                    </label>
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
                                        className="btn button-secondary btn-smz d-flex align-items-center m-0"
                                        onClick={handleBackToRole}
                                        style={{ maxWidth: "80px" }}
                                        type="button"
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

                                    {/* Facility Dropdown for all roles */}
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

                                    {/* Auto-filled District */}
                                    {form.district && (
                                        <div className="form-floating mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="floatingDistrict"
                                                name="district"
                                                value={form.district}
                                                readOnly
                                                placeholder="District"
                                            />
                                            <label htmlFor="floatingDistrict">
                                                District
                                            </label>
                                        </div>
                                    )}

                                    {/* Designation (only for health workers) */}
                                    {selectedRole === "health_worker" && (
                                        <div className="form-floating mb-3">
                                            <select
                                                className="form-select"
                                                id="floatingDesignation"
                                                name="designation"
                                                value={form.designation}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Designation
                                                </option>
                                                <option value="nurse">
                                                    Nurse
                                                </option>
                                                <option value="midwife">
                                                    Midwife
                                                </option>
                                                <option value="community_health_worker">
                                                    Community Health Worker
                                                </option>
                                                <option value="doctor">
                                                    Doctor
                                                </option>
                                                <option value="clinical_manager">
                                                    Clinical Manager
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
                                            <label htmlFor="floatingDesignation">
                                                Designation
                                            </label>
                                        </div>
                                    )}
                                    {selectedRole === "health_worker" && form.designation === "other" && (
  <div className="form-floating mb-3">
    <input
      type="text"
      className="form-control"
      id="floatingCustomDesignation"
      name="custom_designation"
      value={form.custom_designation}
      onChange={handleChange}
      placeholder="Specify your role"
      required
    />
    <label htmlFor="floatingCustomDesignation">Specify Your Role</label>
  </div>
)}

                                    {/* Registration Info & Errors */}
                                    {selectedRole !== "mother" && (
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
