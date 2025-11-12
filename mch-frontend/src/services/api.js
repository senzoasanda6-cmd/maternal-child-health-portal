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

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/refresh") &&
            !originalRequest.url.includes("/login")
        ) {
            originalRequest._retry = true;
            try {
                await csrf.get("/sanctum/csrf-cookie");
                await api.post("/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Session refresh failed:", refreshError);
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
