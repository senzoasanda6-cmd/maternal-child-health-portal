import api from "./api"; // uses your base Axios config

// Fetch all users
export const getUsers = async () => {
    const res = await api.get("/api/admin/users"); // adjust route to match Laravel
    return res.data;
};

// Update a user's role
export const updateUserRole = async (userId, role) => {
    const res = await api.put(`/api/admin/users/${userId}/role`, {
        role,
    });
    return res.data;
};
