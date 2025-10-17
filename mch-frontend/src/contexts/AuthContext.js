import React, { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            await api.post("/api/logout");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("role");
            setUser(null);
            navigate("/login");
        }
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

    const login = async (credentials) => {
        await api.get("/sanctum/csrf-cookie");
        const res = await api.post("/api/login", credentials);
        console.log("Login response:", res.data);
        const user = res.data.user;

        localStorage.setItem("role", user.role);
        setUser(user);

        await fetchUser(); // ✅ Now fetch user after session is established

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
        <AuthContext.Provider
            value={{ user, role: user?.role, login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};
