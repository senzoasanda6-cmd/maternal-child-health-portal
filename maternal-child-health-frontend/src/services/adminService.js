import api from "./api";

export const fetchUsers = () => api.get("/users");
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const fetchHospitals = () => api.get("/admin/hospitals");
export const fetchHospitalDashboard = (id) => api.get(`/admin/hospital/${id}/dashboard`);
export const fetchVisitTrends = (id, department = "All") =>
  api.get(`/hospitals/${id}/visit-trends`, { params: { department } });
