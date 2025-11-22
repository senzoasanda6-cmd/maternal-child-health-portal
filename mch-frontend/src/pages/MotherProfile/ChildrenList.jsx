import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ChildrenList = () => {
    const [children, setChildren] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "",
        age: "",
    });
    const [error, setError] = useState("");
    const [addingNew, setAddingNew] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const res = await api.get("/children");
            setChildren(res.data);
        } catch (err) {
            console.error("Failed to fetch children:", err);
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
        setEditingId(child.id ?? "new");
        setFormData({
            name: child.name || "",
            dob: child.dob || "",
            gender: child.gender || "",
            age: child.dob ? calculateAge(child.dob) : "",
        });
        setAddingNew(isNew);
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
        const trimmedName = formData.name.trim().toLowerCase();
        const duplicate = children.some(
            (c) =>
                (addingNew || c.id !== editingId) &&
                c.name.trim().toLowerCase() === trimmedName
        );

        if (duplicate) {
            setError("Child name must be unique across all profiles.");
            return;
        }

        try {
            let res;
            if (addingNew) {
                res = await api.post("/children", formData);
                setChildren([...children, res.data]);
            } else {
                res = await api.patch(`/children/${editingId}`, formData);
                setChildren(
                    children.map((c) => (c.id === editingId ? res.data : c))
                );
            }

            setEditingId(null);
            setAddingNew(false);
            setFormData({ name: "", dob: "", gender: "", age: "" });
        } catch (err) {
            console.error("Save failed:", err);
            setError("Something went wrong while saving.");
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
        if (editingId === child.id || editingId === "new") return null;
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

    return (
        <div className="container p-4">
            <h2 className="mb-4">👨🏽‍👩🏻‍👧🏽‍👦🏽 My Children</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="text-end mb-3">
                <button
                    className="btn btn-success"
                    onClick={() => handleEdit({}, true)}
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
                    {Array.isArray(children) &&
                        children.map((child) => (
                            <tr key={child.id}>
                                <td>
                                    {editingId === child.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    ) : (
                                        <span
                                            className="text-primary"
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "underline",
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    `/children/${child.id}`
                                                )
                                            }
                                        >
                                            {child.name}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {editingId === child.id ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            readOnly
                                            className="form-control"
                                        />
                                    ) : (
                                        calculateAge(child.dob)
                                    )}
                                </td>
                                <td>
                                    {editingId === child.id ? (
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    ) : (
                                        child.dob
                                    )}
                                </td>
                                <td>
                                    {editingId === child.id ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="form-control"
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">
                                                Female
                                            </option>
                                        </select>
                                    ) : (
                                        child.gender
                                    )}
                                </td>
                                <td>{renderRiskBadge(child)}</td>
                                <td>
                                    {editingId === child.id ? (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setAddingNew(false);
                                                    setFormData({
                                                        name: "",
                                                        dob: "",
                                                        gender: "",
                                                        age: "",
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-secondary btn-sm me-2"
                                                onClick={() =>
                                                    handleEdit(child)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(child.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}

                    {addingNew && editingId === "new" && (
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </td>
                            <td>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </td>
                            <td>
                                <span className="badge bg-warning">New</span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setAddingNew(false)}
                                >
                                    Cancel
                                </button>
                            </td>
                        </tr>
                    )}

                    {(!Array.isArray(children) || children.length === 0) &&
                        !addingNew && (
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
