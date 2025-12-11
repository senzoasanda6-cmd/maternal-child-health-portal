import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "../../components/spinners/Spinner";
import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext); // ✅ Use login from context

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(form); // ✅ Pass the whole form object to the context's login function
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
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
                    <div className="login-card">
                        <h2>Welcome Back</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                style={{ textAlign: "center" }}
                                placeholder="Email Address"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                style={{ textAlign: "center" }}
                                placeholder="Password"
                                required
                            />
                            {error && <p className="error">{error}</p>}
                            <div style={{ marginBottom: "12px" }}></div>
                            <button
                                type="submit"
                                className="button button-primary"
                                style={{ maxWidth: "200px", marginTop: "0" }}
                            >
                                Login
                            </button>
                            <p
                                style={{
                                    marginBottom: "12px",
                                    marginTop: "12px",
                                }}
                            >
                                Or
                            </p>
                            <button
                                type="button"
                                className="button button-secondary"
                                style={{ maxWidth: "200px", marginTop: "0" }}
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>
                            <p className="mt-3 text-center">
                                <span
                                    className="link-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot your password?
                                </span>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
