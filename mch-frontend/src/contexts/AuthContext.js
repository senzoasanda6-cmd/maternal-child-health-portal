import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("authToken"));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setToken(null);
        setUser(null);
        navigate("/login");
    }, [navigate]);

    const fetchUser = useCallback(async () => {
        try {
            const res = await api.get("/api/user");
            setUser(res.data);
        } catch (err) {
            console.error("Auth error:", err);
            logout();
        } finally {
            setLoading(false);
        }
    }, [logout]);

    useEffect(() => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token, fetchUser]);

    const login = async (credentials) => {
        const res = await api.post("/api/login", credentials);
        const { token, user } = res.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("role", user.role);
        setToken(token);
        setUser(user);

        switch (user.role) {
            case "admin":
                navigate("/admin/home");
                break;
            case "health_worker":
                navigate("/health/dashboard");
                break;
            case "mother":
                navigate("/mother/home");
                break;
            default:
                navigate("/");
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
