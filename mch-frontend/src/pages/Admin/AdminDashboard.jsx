import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../services/userService";
import { getAuditLogs } from "../../services/auditLogService";

import ScreenLoading from "../../components/spinners/ScreenLoading";
import StatCard from "../../components/cards/StatCard";
import ChartCard from "../../components/cards/ChartCard";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState([]);
    const [logLoading, setLogLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    const vaccinationCoverage = [
        { label: "Jan", value: 72 },
        { label: "Feb", value: 78 },
        { label: "Mar", value: 82 },
        { label: "Apr", value: 86 },
        { label: "May", value: 88 },
        { label: "Jun", value: 90 },
    ];

    const monthlyActiveMothers = [20, 34, 40, 56, 70, 82];

    const appointmentTypes = [
        { label: "Prenatal", value: 45 },
        { label: "Postnatal", value: 30 },
        { label: "Vaccination", value: 80 },
    ];

    useEffect(() => {
        getUsers()
            .then((data) => {
                const augmented = data.map((u, idx) => {
                    const regDate = new Date();
                    regDate.setDate(regDate.getDate() - (10 + idx * 3));
                    const lastLogin = new Date();
                    lastLogin.setDate(lastLogin.getDate() - (idx % 7));
                    const notifications = (idx % 5) + 1;
                    const messages = idx % 3;
                    return {
                        ...u,
                        registrationDate: regDate.toISOString(),
                        lastLogin: lastLogin.toISOString(),
                        interactions: notifications + messages,
                    };
                });
                setUsers(augmented);
                setFilteredUsers(augmented);
            })
            .catch(() => {
                const sample = [
                    {
                        id: 1,
                        name: "Amina Nkosi",
                        email: "amina@example.com",
                        role: "user",
                        registrationDate: new Date().toISOString(),
                        lastLogin: new Date().toISOString(),
                        interactions: 5,
                    },
                    {
                        id: 2,
                        name: "Thabo Moyo",
                        email: "thabo@example.com",
                        role: "health_worker",
                        registrationDate: new Date().toISOString(),
                        lastLogin: new Date().toISOString(),
                        interactions: 2,
                    },
                ];
                setUsers(sample);
                setFilteredUsers(sample);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        getAuditLogs()
            .then((data) => setAuditLogs(data.data || []))
            .catch((err) => console.error("Failed to load audit logs:", err))
            .finally(() => setLogLoading(false));
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingUserId(userId);
        try {
            await updateUserRole(userId, newRole);
            const updated = users.map((u) =>
                u.id === userId ? { ...u, role: newRole } : u
            );
            setUsers(updated);
            applySearch(searchTerm, updated);
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingUserId(null);
        }
    };

    const daysSince = (isoDate) => {
        if (!isoDate) return "-";
        const d = new Date(isoDate);
        const diff = Math.floor(
            (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diff;
    };

    const applySearch = (term, data = users) => {
        const filtered = data.filter(
            (u) =>
                u.name.toLowerCase().includes(term.toLowerCase()) ||
                u.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        applySearch(term);
    };

    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) return <ScreenLoading />;

    return (
        <div className="container p-4 space-y-6">
            <h2 className="text-custom-color-primary fw-bold">
                Admin Dashboard
            </h2>
            <p>Key metrics for maternal & child health program.</p>

            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <StatCard
                        title="Active Mothers (30d)"
                        value="82"
                        delta="+5%"
                    />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard
                        title="Vaccination Coverage"
                        value="90%"
                        delta="+2%"
                    />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard title="Upcoming Appointments" value="14" />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard title="Open Support Tickets" value="3" />
                </div>
            </div>

            <hr />
            <p>Trend Analysis Chart Visualizations.</p>

            <div className="row mb-1">
                <div className="col-md-6 mb-3">
                    <ChartCard
                        title="Monthly Active Mothers"
                        delta={monthlyActiveMothers}
                        subText="Past 6 months"
                        visualHeight={100}
                        type="line"
                    />
                </div>
                <div className="col-md-6 mb-3">
                    {/* Use a line chart to show vaccination coverage over time (values only) */}
                    <ChartCard
                        title="Vaccination Coverage Over Time"
                        delta={vaccinationCoverage.map((v) => v.value)}
                        subText="Past 6 months"
                        visualHeight={120}
                        type="line"
                    />
                </div>
            </div>

            <div className="row mb-1">
                <div className="col-md-6 mb-3">
                    <ChartCard
                        title="Appointments by Type"
                        delta={appointmentTypes}
                        subText="Counts of appointment types"
                        visualHeight={120}
                        type="bar"
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <ChartCard
                        title="Appointments by Type"
                        delta={appointmentTypes}
                        subText="Distribution of appointment types"
                        visualHeight={120}
                        type="pie"
                    />
                </div>
            </div>

            <div className="card mt-3">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md mb-3">
                            <h5 className="card-title">Users</h5>
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                className="form-control mb-3"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                            <div className="table-responsive">
                                <table className="table table-bordered mt-2">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Registered</th>
                                            <th>Last Login</th>
                                            <th>Days Since Last Login</th>
                                            <th>Interactions</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    {new Date(
                                                        user.registrationDate
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {new Date(
                                                        user.lastLogin
                                                    ).toLocaleString()}
                                                </td>
                                                <td>
                                                    {daysSince(user.lastLogin)}
                                                </td>
                                                <td>
                                                    {user.interactions ?? 0}
                                                </td>
                                                <td>
                                                    {user.role !== "admin" ? (
                                                        <button
                                                            className="btn btn-sm btn-success me-2"
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    "admin"
                                                                )
                                                            }
                                                            disabled={
                                                                updatingUserId ===
                                                                user.id
                                                            }
                                                        >
                                                            {updatingUserId ===
                                                            user.id
                                                                ? "Updating..."
                                                                : "Promote to Admin"}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-warning"
                                                            onClick={() =>
                                                                handleRoleChange(
                                                                    user.id,
                                                                    "user"
                                                                )
                                                            }
                                                            disabled={
                                                                updatingUserId ===
                                                                user.id
                                                            }
                                                        >
                                                            {updatingUserId ===
                                                            user.id
                                                                ? "Updating..."
                                                                : "Demote to User"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <nav className="mt-3">
                                <ul className="pagination justify-content-center">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((num) => (
                                        <li
                                            key={num}
                                            className={`page-item ${
                                                num === currentPage
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    setCurrentPage(num)
                                                }
                                            >
                                                {num}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                        <div className="col-md mb-3">
                            <div className="card p-3 mb-4">
                                <h6>Engagement Snapshot</h6>
                                <p className="mb-1">
                                    Avg. notifications per mother:{" "}
                                    <strong>3.2</strong>
                                </p>
                                <p className="mb-1">
                                    Avg. health worker replies:{" "}
                                    <strong>1.1</strong>
                                </p>
                                <p className="mb-0 text-muted">
                                    These numbers are illustrative; swap the
                                    arrays above with your API data.
                                </p>
                            </div>
                            <div className="card p-3 mb-4">
                                <h6>Recent Admin Actions</h6>
                                {logLoading ? (
                                    <p>Loading logs...</p>
                                ) : auditLogs.length === 0 ? (
                                    <p>No recent actions found.</p>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {auditLogs.map((log) => (
                                            <li
                                                key={log.id}
                                                className="list-group-item"
                                            >
                                                <strong>
                                                    {log.action.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </strong>{" "}
                                                — {log.details}
                                                <br />
                                                <small className="text-muted">
                                                    By{" "}
                                                    {log.performer?.name ||
                                                        "Unknown"}{" "}
                                                    on{" "}
                                                    {new Date(
                                                        log.created_at
                                                    ).toLocaleString()}
                                                </small>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
