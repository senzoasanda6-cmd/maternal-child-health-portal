import React, { createContext, useState, useCallback, useEffect } from "react";
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
        const maxRetries = 2;
        let attempt = 0;
        while (attempt <= maxRetries) {
            try {
                const res = await api.get("/api/user");
                setUser(res.data);
                break;
            } catch (err) {
                attempt += 1;
                console.error(`Auth error (attempt ${attempt}):`, err);
                // If unauthorized, immediately logout and stop retrying
                if (err?.response?.status === 401) {
                    try {
                        await logout();
                    } catch (e) {
                        console.error("Logout failed:", e);
                        setUser(null);
                    }
                    break;
                }

                if (attempt > maxRetries) {
                    // After retries, give up and clear user (network might be down)
                    setUser(null);
                    break;
                }

                // small delay before retrying (simple backoff)
                await new Promise((res) => setTimeout(res, 500 * attempt));
            } finally {
                // if we exit loop with a user set, ensure loading still becomes false
                if (attempt > maxRetries || user) {
                    setLoading(false);
                }
            }
        }
    }, [logout]);

    // Attempt to fetch user on provider mount so auth state is available
    // when users navigate between public and protected routes.
    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
