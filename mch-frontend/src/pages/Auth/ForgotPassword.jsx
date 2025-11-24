import React, { useState } from "react";
import api from "../../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        setError("");

        try {
            const res = await api.post("/mother/password/email", { email });
            setStatus("A password reset link has been sent to your email.");
        } catch (err) {
            setError(
                err.response?.data?.message || "Error sending reset link."
            );
        }
    };

    return (
        <div className="auth-container">
            <h2>Forgot Password</h2>

            {status && <div className="alert alert-success">{status}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Email</label>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                    Send Reset Link
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;
