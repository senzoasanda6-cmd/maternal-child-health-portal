import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../services/userService";

import ScreenLoading from "../../components/spinners/ScreenLoading";

// Small reusable stat card
const StatCard = ({ title, value, delta }) => (
    <div className="card text-center p-3">
        <div className="card-body">
            <h6 className="card-title text-muted">{title}</h6>
            <h3 className="card-text">{value}</h3>
            {delta !== undefined && (
                <small className="text-muted">{delta}</small>
            )}
        </div>
    </div>
);

// Simple bar chart using SVG. Data is array of {label, value}.
const SimpleBarChart = ({ data = [], height = 120 }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    const barWidth = Math.floor(100 / Math.max(data.length, 1));

    return (
        <svg viewBox={`0 0 100 ${height}`} width="100%" height="${height}">
            {data.map((d, i) => {
                const h = (d.value / max) * (height - 20);
                return (
                    <g key={i} transform={`translate(${i * barWidth + 2}, ${height - h - 10})`}>
                        <rect width={barWidth - 4} height={h} fill="#4e73df" rx="2" />
                        <text x={(barWidth - 4) / 2} y={h + 12} fontSize="3" fill="#333" textAnchor="middle">
                            {d.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

// Simple line chart using SVG. Data is array of numbers.
const SimpleLineChart = ({ data = [], height = 80 }) => {
    const max = Math.max(...data, 1);
    const step = data.length > 1 ? 100 / (data.length - 1) : 100;
    const points = data
        .map((v, i) => `${i * step},${height - (v / max) * height}`)
        .join(" ");

    return (
        <svg viewBox={`0 0 100 ${height}`} width="100%" height="${height}">
            <polyline
                fill="none"
                stroke="#1cc88a"
                strokeWidth="1.5"
                points={points}
            />
        </svg>
    );
};

const AdminDashboard = () => {
    // Sample data arrays — replace these with axios/async responses.
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Example metrics for charts (hardcoded). Shape is intentional so
    // you can swap these with fetched data quickly.
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
        // Fetch users — keep existing service usage so it can be swapped.
        getUsers()
            .then((data) => {
                // For illustration, if the backend doesn't provide
                // registration/login/interactions, we augment it here.
                const augmented = data.map((u, idx) => {
                    const regDate = new Date();
                    regDate.setDate(regDate.getDate() - (10 + idx * 3));
                    const lastLogin = new Date();
                    lastLogin.setDate(lastLogin.getDate() - (idx % 7));
                    const notifications = (idx % 5) + 1; // sample
                    const messages = (idx % 3) + 0; // sample
                    return {
                        ...u,
                        registrationDate: regDate.toISOString(),
                        lastLogin: lastLogin.toISOString(),
                        interactions: notifications + messages,
                    };
                });
                setUsers(augmented);
            })
            .catch(() => {
                // Fallback: sample users if request fails
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
            })
            .finally(() => setLoading(false));
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole(userId, newRole);
            const updated = users.map((u) =>
                u.id === userId ? { ...u, role: newRole } : u
            );
            setUsers(updated);
        } catch (err) {
            // ignore for sample — in real app show toast
            console.error(err);
        }
    };

    const daysSince = (isoDate) => {
        if (!isoDate) return "-";
        const d = new Date(isoDate);
        const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    if (loading) return <ScreenLoading />;

    return (
        <div className="container p-4 space-y-6">
            <h2>Admin Dashboard</h2>
            <p>Key metrics for maternal & child health program.</p>

            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <StatCard title="Active Mothers (30d)" value="82" delta="+5%" />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard title="Vaccination Coverage" value="90%" delta="+2%" />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard title="Upcoming Appointments" value="14" />
                </div>
                <div className="col-6 col-md-3">
                    <StatCard title="Open Support Tickets" value="3" />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <div className="card p-3">
                        <h6>Vaccination Coverage (last 6 months)</h6>
                        <div style={{ height: 140 }}>
                            <SimpleBarChart data={vaccinationCoverage} height={120} />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="card p-3">
                        <h6>Monthly Active Mothers</h6>
                        <div style={{ height: 100 }}>
                            <SimpleLineChart data={monthlyActiveMothers} height={80} />
                        </div>
                        <small className="text-muted">Past 6 months</small>
                    </div>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card p-3">
                        <h6>Appointments by Type</h6>
                        <div style={{ height: 120 }}>
                            <SimpleBarChart data={appointmentTypes} height={100} />
                        </div>
                        <small className="text-muted">Counts of appointment types</small>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <h6>Engagement Snapshot</h6>
                        <p className="mb-1">Avg. notifications per mother: <strong>3.2</strong></p>
                        <p className="mb-1">Avg. health worker replies: <strong>1.1</strong></p>
                        <p className="mb-0 text-muted">These numbers are illustrative; swap the arrays above with your API data.</p>
                    </div>
                </div>
            </div>

            {/* Users table moved to bottom with extra columns */}
            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">Users</h5>
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
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                                        <td>{new Date(user.lastLogin).toLocaleString()}</td>
                                        <td>{daysSince(user.lastLogin)}</td>
                                        <td>{user.interactions ?? 0}</td>
                                        <td>
                                            {user.role !== "admin" ? (
                                                <button
                                                    className="btn btn-sm btn-success me-2"
                                                    onClick={() => handleRoleChange(user.id, "admin")}
                                                >
                                                    Promote to Admin
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => handleRoleChange(user.id, "user")}
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
