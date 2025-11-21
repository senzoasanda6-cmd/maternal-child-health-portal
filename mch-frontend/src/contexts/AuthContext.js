import React, { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { csrf } from "../services/api";

export const AuthContext = createContext();

// 🔧 Moved outside to avoid hook dependency warnings
const subRoleMap = {
    midwife: "health_worker",
    facility_worker: "health_worker",
    facility_nurse: "health_worker",
    facility_doctor: "health_worker",
    facility_admin: "health_worker",
    facility_manager: "health_worker",
    hospital_admin: "health_worker",
};

const roleRedirects = {
    mother: "/mother/home",
    health_worker: "/health/dashboard",
    admin: "/admin/home",
    district_admin: "/district/home",
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(async () => {
        try {
            await api.post("/logout"); // No change needed here, but good for reference
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("api_token");
            localStorage.removeItem("role");
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);

    const refreshToken = useCallback(async () => {
        try {
            // Refresh CSRF cookie and attempt to GET /user. The POST /refresh
            // route in this project is behind auth:sanctum, so calling it when
            // unauthenticated will return 401. Using GET /user after
            // requesting the CSRF cookie is a safe way to detect whether a
            // session cookie is valid and recover the user without hitting a
            // protected refresh endpoint.
            await csrf.get("/sanctum/csrf-cookie");
            const res = await api.get("/user");
            const refreshedUser = res.data;
            if (!refreshedUser) throw new Error("Missing user data on refresh");

            const normalizedRole = refreshedUser.role?.toLowerCase();
            const effectiveRole = subRoleMap[normalizedRole] || normalizedRole;

            setUser({ ...refreshedUser, role: effectiveRole });
            localStorage.setItem("role", effectiveRole);
            await new Promise((res) => setTimeout(res, 300));
            return true;
        } catch (err) {
            console.error("Token refresh failed:", err);
            return false;
        }
    }, []);

    const fetchUser = useCallback(async () => {
        try {
            const res = await api.get("/user"); // No change needed here, but good for reference
            const fetchedUser = res.data;

            const normalizedRole = fetchedUser.role?.toLowerCase();
            const effectiveRole = subRoleMap[normalizedRole] || normalizedRole;

            setUser({ ...fetchedUser, role: effectiveRole });
            localStorage.setItem("role", effectiveRole);
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshed = await refreshToken();
                if (!refreshed) {
                    localStorage.removeItem("role");
                    setUser(null);
                }
            } else {
                console.error("Fetch user failed:", err);
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    }, [refreshToken]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Listen for global 'auth:required' events (emitted by the API layer when
    // token/session refresh fails). Navigate the user to the login page so a
    // clear login prompt is shown instead of repeated console errors.
    useEffect(() => {
        const onAuthRequired = (e) => {
            localStorage.removeItem("role");
            setUser(null);
            navigate("/login");
        };

        window.addEventListener("auth:required", onAuthRequired);
        return () => window.removeEventListener("auth:required", onAuthRequired);
    }, [navigate]);

    const login = async (credentials) => {
        try {
            // Step 1: Check if already authenticated
            const existing = await api.get("/user"); // No change needed here, but good for reference
            if (existing?.data) {
                const normalizedRole = existing.data.role?.toLowerCase();
                const effectiveRole =
                    subRoleMap[normalizedRole] || normalizedRole;
                setUser({ ...existing.data, role: effectiveRole });
                localStorage.setItem("role", effectiveRole);
                navigate(roleRedirects[effectiveRole] || "/unauthorized");
                return;
            }
        } catch {
            // Not authenticated — proceed to login
        }

        // Step 2: Proceed with login
        await csrf.get("/sanctum/csrf-cookie"); // No change needed here, but good for reference
        const res = await api.post("/login", credentials); // No change needed here, but good for reference
        const user = res.data.user;
        if (!user) throw new Error("Login response missing user data");

        const normalizedRole = user.role?.toLowerCase();
        const effectiveRole = subRoleMap[normalizedRole] || normalizedRole;

        localStorage.setItem("role", effectiveRole);
        setUser({ ...user, role: effectiveRole });

        const redirectPath = roleRedirects[effectiveRole];
        if (redirectPath) {
            navigate(redirectPath);
        } else {
            console.warn("Unknown role:", effectiveRole);
            navigate("/unauthorized");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                role: user?.role,
                district: user?.district_id,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
