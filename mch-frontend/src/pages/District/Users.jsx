import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const params = new URLSearchParams();
                if (filterRole) params.append("role", filterRole);
                if (searchTerm) params.append("search", searchTerm);
                params.append("page", currentPage);

                const response = await api.get(
                    `/district/users?${params.toString()}`
                );
                setUsers(response.data.data || []);
            } catch (err) {
                console.error("Failed to load users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [filterRole, searchTerm, currentPage]);

    if (loading) return <p>Loading health workers...</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4">Health Workers</h2>

            {/* Filters */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={filterRole}
                        onChange={(e) => {
                            setFilterRole(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Roles</option>
                        <option value="health_worker">Health Worker</option>
                        <option value="midwife">Midwife</option>
                        <option value="nurse">Nurse</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div>
                <div className="col-md-8">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Users Table */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Sub-Role</th>
                        <th>Facility</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="badge bg-primary">
                                        {user.role}
                                    </span>
                                </td>
                                <td>{user.sub_role || "—"}</td>
                                <td>{user.facility}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-info"
                                        onClick={() =>
                                            window.location.href = `/district/users/${user.id}`
                                        }
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No health workers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
