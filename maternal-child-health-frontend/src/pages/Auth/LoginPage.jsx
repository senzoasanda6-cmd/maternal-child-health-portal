import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(form);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="login-page">
            <div className="login-wrapper">
                {" "}
                <div className="login-left">
                    {" "}
                    <div className="image-container">
                        {" "}
                        <img
                            src="/mother_child.jpg"
                            alt="Mother and Child"
                            className="side-image"
                        />{" "}
                        <div className="image-overlay">
                            {" "}
                            <img
                                src="/gdoh.jpeg"
                                alt="GDOH Logo"
                                className="login-logo"
                            />{" "}
                            <h1>Maternal & Child Health Portal</h1>{" "}
                            <p>
                                Supporting healthy mothers and children through
                                technology
                            </p>{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
                <div className="login-right">
                    {" "}
                    <div className="login-card">
                        {" "}
                        <h2>Welcome Back</h2>{" "}
                        <form onSubmit={handleSubmit}>
                            {" "}
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />{" "}
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />{" "}
                            {error && <p className="error">{error}</p>}{" "}
                            <button type="submit">Login</button>{" "}
                            <p style={{marginBottom: '4px', marginTop: '12px'}}>Or</p>
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>

                        </form>{" "}
                    </div>{" "}
                </div>{" "}
            </div>{" "}
        </div>
    );
}

export default LoginPage;
