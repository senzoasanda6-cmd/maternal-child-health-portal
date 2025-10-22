import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Spinner from "../../components/spinners/Spinner";

import AppPageLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingUserId, setUpdatingUserId] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;

        try {
            await api.delete(`/api/admin/users/${id}`);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete user.");
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/admin/users");
                setUsers(res.data);
                setFilteredUsers(res.data);
            } catch (err) {
                console.error("Failed to load users:", err);
                setError("Unable to fetch user list.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = [...users];

        if (roleFilter !== "all") {
            filtered = filtered.filter((u) => u.role === roleFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (u) =>
                    u.name.toLowerCase().includes(term) ||
                    u.email.toLowerCase().includes(term)
            );
        }

        setFilteredUsers(filtered);
    }, [searchTerm, roleFilter, users]);

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingUserId(userId);
        try {
            // We only need to send the role for this update
            await api.put(`/api/admin/users/${userId}`, { role: newRole });
            setUsers(
                users.map((u) =>
                    u.id === userId ? { ...u, role: newRole } : u
                )
            );
        } catch (err) {
            console.error("Role update failed:", err);
            alert("Failed to update user role.");
        } finally {
            setUpdatingUserId(null);
        }
    };

    if (loading) return <AppPageLoading loadingText="Loading users..." />;
    if (error) return <AppLoadError message={error} />;

    return (
        <div className="container p-4 space-y-6">
            <h2 className="mb-4">User Management</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="health_worker">Health Worker</option>
                        <option value="mother">Mother</option>
                    </select>
                </div>
            </div>

            <Link to="/admin/users/create" className="btn btn-success mb-3">
                + Create New User
            </Link>

            {filteredUsers.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Hospital</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {updatingUserId === user.id ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <select
                                            className="form-select form-select-sm"
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    user.id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="mother">
                                                Mother
                                            </option>
                                            <option value="health_worker">
                                                Health Worker
                                            </option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    )}
                                </td>
                                <td>
                                    {user.facility ? (
                                        <>
                                            <div>
                                                <strong>
                                                    {user.facility.name}
                                                </strong>
                                            </div>
                                            <div className="text-muted small">
                                                {user.facility.type} –{" "}
                                                {user.facility.district}
                                            </div>
                                        </>
                                    ) : (
                                        "—"
                                    )}
                                </td>

                                <td>
                                    <Link
                                        to={`/admin/users/${user.id}/edit`}
                                        className="btn btn-sm btn-outline-primary me-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;
