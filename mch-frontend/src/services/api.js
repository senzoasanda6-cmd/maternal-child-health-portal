import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Helper to extract a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
}

// Separate Axios instance for CSRF cookie
export const csrf = axios.create({
    baseURL: API_BASE_URL, // Use environment variable
    withCredentials: true,
});

// Main API instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`, // Use environment variable
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach tokens to every request
api.interceptors.request.use(
    (config) => {
        // 1. Attach CSRF token for cookie-based authentication
        const xsrfToken = getCookie("XSRF-TOKEN");
        if (xsrfToken) {
            config.headers["X-XSRF-TOKEN"] = xsrfToken;
        }

        // 2. Attach Bearer token for token-based authentication
        const apiToken = localStorage.getItem("api_token");
        if (apiToken) {
            config.headers.Authorization = `Bearer ${apiToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Automatic token/session refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh for 401 errors on certain endpoints, and only once per request
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/user") &&
            !originalRequest.url.includes("/refresh") &&
            !originalRequest.url.includes("/login") &&
            !originalRequest.url.includes("/sanctum/csrf-cookie")
        ) {
            originalRequest._retry = true;
            try {
                // Try to refresh the CSRF cookie
                await csrf.get("/sanctum/csrf-cookie");
                // Attempt to fetch current user without triggering another 401 retry
                const userRes = await api.get("/user");
                if (userRes?.status === 200 && userRes.data) {
                    // Session is valid, retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Session refresh failed. Emit global event so UI can show login modal.
                try {
                    window.dispatchEvent(new CustomEvent("auth:required", { detail: { error: refreshError } }));
                } catch (e) {
                    // ignore in non-browser environments
                }
                console.warn("Session refresh failed:", refreshError.response?.status || refreshError.message);
            }
        }

        return Promise.reject(error);
    }
);

// ✅ Check if user is already authenticated
export async function checkAuth() {
    try {
        const response = await api.get("/user");
        return response.data;
    } catch {
        return null;
    }
}

// ✅ Login flow with auth check
export async function login(email, password) {
    await csrf.get("/sanctum/csrf-cookie");
    const response = await api.post("/login", { email, password });
    return response.data;
}

export default api;
