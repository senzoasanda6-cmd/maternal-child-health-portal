import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const token = params.get("token");
    const emailParam = params.get("email");

    const [form, setForm] = useState({
        email: emailParam || "",
        password: "",
        password_confirmation: ""
    });

    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setError("");

        try {
            const res = await api.post("/mother/password/reset", {
                ...form,
                token,
            });

            setStatus("Password reset successfully. Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Could not reset password.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>

            {status && <div className="alert alert-success">{status}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
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
                        required
                    />
                    <label>New Password</label>
                </div>

                {/* Confirm Password */}
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                    />
                    <label>Confirm Password</label>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;
