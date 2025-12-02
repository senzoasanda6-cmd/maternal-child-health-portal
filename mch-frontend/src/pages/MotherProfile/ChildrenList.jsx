import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AppLoading from "../../components/spinners/AppPageLoading";

// Helper to format date for display and input
const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
};

const ChildFormRow = ({ formData, onSave, onCancel, onChange, saving }) => (
    <tr>
        <td>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="form-control"
                placeholder="Child's Name"
            />
        </td>
        <td>
            <input
                type="number"
                name="age"
                value={formData.age}
                readOnly
                className="form-control"
                placeholder="Age"
            />
        </td>
        <td>
            <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={onChange}
                className="form-control"
            />
        </td>
        <td>
            <select
                name="gender"
                value={formData.gender}
                onChange={onChange}
                className="form-control"
            >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </td>
        <td>
            {formData.id === 'new' && <span className="badge bg-warning">New</span>}
        </td>
        <td>
            <button
                className="btn btn-success btn-sm me-2"
                onClick={onSave}
                disabled={saving}
            >
                {saving ? "Saving..." : "Save"}
            </button>
            <button
                className="btn btn-secondary btn-sm"
                onClick={onCancel}
                disabled={saving}
            >
                Cancel
            </button>
        </td>
    </tr>
);

const ChildrenList = () => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        dob: "",
        gender: "",
        age: "",
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const res = await api.get("/children");
            setChildren(res.data);
        } catch (err) {
            console.error("Failed to fetch children:", err);
            setError("Failed to load your children's data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleEdit = (child = {}, isNew = false) => {
        const id = isNew ? "new" : child.id;
        setEditingId(id);
        setFormData({
            id: id,
            name: child.name || "",
            dob: formatDate(child.dob) || "",
            gender: child.gender || "",
            age: child.dob ? calculateAge(child.dob) : "",
        });
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };
        if (name === "dob") {
            updatedData.age = calculateAge(value);
        }
        setFormData(updatedData);
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");

        const trimmedName = formData.name.trim().toLowerCase();
        const duplicate = children.some(
            (c) =>
                c.id !== editingId &&
                c.name.trim().toLowerCase() === trimmedName
        );

        if (duplicate) {
            setError("Child name must be unique across all profiles.");
            setSaving(false);
            return;
        }

        try {
            const isNew = editingId === "new";
            const payload = { name: formData.name, dob: formData.dob, gender: formData.gender };

            let savedChild;
            if (isNew) {
                const res = await api.post("/children", payload);
                savedChild = res.data;
                setChildren([...children, savedChild]);
            } else {
                const res = await api.patch(`/children/${editingId}`, payload);
                savedChild = res.data;
                setChildren(
                    children.map((c) => (c.id === editingId ? savedChild : c))
                );
            }

            setEditingId(null);
        } catch (err) {
            console.error("Save failed:", err);
            setError(err.response?.data?.message || "Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this child?"))
            return;
        try {
            await api.delete(`/children/${id}`);
            setChildren(children.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete child.");
        }
    };

    const renderRiskBadge = (child) => {
        if (editingId === child.id) return null;
        if (child.high_risk) {
            return (
                <span
                    className="badge bg-danger ms-2"
                    title="This child is high-risk and may require extra attention."
                >
                    High Risk
                </span>
            );
        }
        return <span className="badge bg-success ms-2">Normal</span>;
    };

    const handleCancel = () => {
        setEditingId(null);
        setError("");
    };

    if (loading) return <AppLoading loadingText="Loading children..." />;

    return (
        <div className="container p-4">
            <h2 className="mb-4">👨🏽‍👩🏻‍👧🏽‍👦🏽 My Children</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="text-end mb-3">
                <button
                    className="btn btn-success"
                    onClick={() => handleEdit({}, true)}
                    disabled={editingId !== null}
                >
                    + New Child
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-light">
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Birth Date</th>
                        <th>Gender</th>
                        <th>Risk Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {editingId === "new" && (
                        <ChildFormRow
                            formData={formData}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onChange={handleChange}
                            saving={saving}
                        />
                    )}
                    {children.length > 0 &&
                        children.map((child) => (
                            editingId === child.id ? (
                                <ChildFormRow
                                    key={child.id}
                                    formData={formData}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    onChange={handleChange}
                                    saving={saving}
                                />
                            ) : (
                                <tr key={child.id}>
                                    <td>
                                        <span
                                            className="text-primary"
                                            style={{ cursor: "pointer", textDecoration: "underline" }}
                                            onClick={() => navigate(`/children/${child.id}`)}
                                        >
                                            {child.name}
                                        </span>
                                    </td>
                                    <td>{calculateAge(child.dob)}</td>
                                    <td>{formatDate(child.dob)}</td>
                                    <td>{child.gender}</td>
                                    <td>{renderRiskBadge(child)}</td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => handleEdit(child)}
                                            disabled={editingId !== null}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(child.id)}
                                            disabled={editingId !== null}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        ))}

                    {children.length === 0 && editingId !== "new" && (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No children found. Click "+ New Child" to
                                    add one.
                                </td>
                            </tr>
                        )}
                </tbody>
            </table>
        </div>
    );
};

export default ChildrenList;
