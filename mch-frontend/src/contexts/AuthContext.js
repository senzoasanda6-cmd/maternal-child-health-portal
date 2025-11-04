import React, { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const roleRedirects = {
        admin: "/admin/home",
        health_worker: "/health/dashboard",
        mother: "/mother/home",
        district_admin: "/district/home",
        hospital_admin: "/admin/home",
        facility_admin: "/admin/home",
        facility_manager: "/admin/home",
        midwife: "/health/dashboard",
        facility_worker: "/health/dashboard",
        facility_nurse: "/health/dashboard",
        facility_doctor: "/health/dashboard",
    };

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

    const refreshToken = useCallback(async () => {
        try {
            await api.get("/sanctum/csrf-cookie");
            const res = await api.post("/api/refresh");
            const refreshedUser = res.data.user;
            if (!refreshedUser) throw new Error("Missing user data on refresh");
            setUser(refreshedUser);
            localStorage.setItem("role", refreshedUser.role);
            await new Promise((res) => setTimeout(res, 300)); // small delay before retry
            return true;
        } catch (err) {
            console.error("Token refresh failed:", err);
            return false;
        }
    }, []);

    const fetchUser = useCallback(async () => {
        const role = localStorage.getItem("role");
        if (!role) {
            setLoading(false);
            return;
        }

        const maxRetries = 2;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                const res = await api.get("/api/user");
                setUser(res.data);
                break;
            } catch (err) {
                attempt += 1;

                if (!err.response) {
                    console.error("Server unreachable:", err.message);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                if (err.response?.status === 401) {
                    const refreshed = await refreshToken();
                    if (!refreshed) {
                        localStorage.removeItem("role");
                        setUser(null);
                        break;
                    }
                    continue;
                }

                if (attempt > maxRetries) {
                    setUser(null);
                    localStorage.removeItem("role");
                    break;
                }

                const delay = 500 * attempt;
                await new Promise((res) => setTimeout(res, delay));
            }
        }
        setLoading(false);
    }, [refreshToken]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        await api.get("/sanctum/csrf-cookie");
        const res = await api.post("/api/login", credentials);
        const user = res.data.user;
        if (!user) throw new Error("Login response missing user data");

        localStorage.setItem("role", user.role);
        setUser(user);

        const redirectPath = roleRedirects[user.role] || "/";
        navigate(redirectPath);
    };

    return (
        <AuthContext.Provider
            value={{ user, role: user?.role, login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
