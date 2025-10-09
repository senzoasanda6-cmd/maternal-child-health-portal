import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUserRole = async (userId, newRole) => {
  await api.put(`/users/${userId}/role`, { role: newRole });
};
