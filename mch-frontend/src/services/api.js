import axios from "axios";

// Helper to extract a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(";").shift());
    }
    return null;
}

// Create Axios instance
const api = axios.create({
    baseURL: "", // CRA proxy forwards to Laravel backend
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach CSRF token to every request
api.interceptors.request.use(
    (config) => {
        const xsrfToken = getCookie("XSRF-TOKEN");
        if (xsrfToken) {
            config.headers["X-XSRF-TOKEN"] = xsrfToken;
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

        // If 401 and not already retried
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/api/refresh") &&
            !originalRequest.url.includes("/api/login")
        ) {
            originalRequest._retry = true;
            try {
                await api.get("/sanctum/csrf-cookie");
                await api.post("/api/refresh");
                return api(originalRequest); // Retry original request
            } catch (refreshError) {
                console.error("Session refresh failed:", refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
