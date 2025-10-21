import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../services/userService";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        await updateUserRole(userId, newRole);
        const updated = users.map((u) =>
            u.id === userId ? { ...u, role: newRole } : u
        );
        setUsers(updated);
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="container py-4">
            <h2>Admin Dashboard</h2>
            <p>Manage user roles and monitor activity.</p>

            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role !== "admin" ? (
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() =>
                                            handleRoleChange(user.id, "admin")
                                        }
                                    >
                                        Promote to Admin
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-warning"
                                        onClick={() =>
                                            handleRoleChange(user.id, "user")
                                        }
                                    >
                                        Demote to User
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
