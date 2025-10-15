import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import "./LoginPage.css";

function RegisterPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        hospital_id: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (form.password !== form.password_confirmation) {
            setError("Passwords do not match");
            return;
        }
        try {
            await register(form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    const currentUserRole = "admin"; // Replace with actual current user role

    return (
        <div className="login-page">
            <div className="login-wrapper">
                <div className="login-left">
                    <div className="image-container">
                        <img
                            src="/mother_child.jpg"
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
                        <h2>Create an Account</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                            <input
                                type="password"
                                name="password_confirmation"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                            />
                            <select name="role" value={form.role} onChange={handleChange} required>
                                <option value="">Select Role</option>
                                <option value="mother">Mother</option>
                                <option value="child">Child</option>
                                <option value="health_worker">Health Worker</option>
                                {currentUserRole === "admin" && (
                                    <>
                                        <option value="manager">Manager</option>
                                        <option value="clinical_manager">Clinical Manager</option>
                                    </>
                                )}
                            </select>
                            <select name="hospital_id" value={form.hospital_id} onChange={handleChange}>
                                <option value="">Select Hospital (Optional)</option>
                                {/* Replace with dynamic hospital list */}
                                <option value="1">Johannesburg General</option>
                                <option value="2">Soweto Clinic</option>
                            </select>
                            {error && <p className="error">{error}</p>}
                            <button type="submit">Register</button>
                            <p>
                                Already have an account?{" "}
                                <span
                                    className="link-primary"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;