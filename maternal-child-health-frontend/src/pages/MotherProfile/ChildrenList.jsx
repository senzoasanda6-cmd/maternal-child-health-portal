import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Axios instance with auth headers

const ChildrenList = () => {
    const [children, setChildren] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        dob: "",
    });
    const [error, setError] = useState("");
    const [addingNew, setAddingNew] = useState(false);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const res = await api.get("/api/children");
            setChildren(res.data);
            console.log("API response:", res.data);
        } catch (err) {
            console.error("Failed to fetch children:", err);
        }
    };

    const handleEdit = (child = {}, isNew = false) => {
        setEditingId(child.id ?? "new");
        setFormData({
            name: child.name || "",
            age: child.age || "",
            gender: child.gender || "",
            dob: child.dob || "",
        });
        setAddingNew(isNew);
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            if (addingNew) {
                const res = await api.post("/api/children", formData);
                setChildren([...children, res.data]);
            } else {
                const res = await api.patch(
                    `/api/children/${editingId}`,
                    formData
                );
                setChildren(
                    children.map((c) => (c.id === editingId ? res.data : c))
                );
            }

            setEditingId(null);
            setFormData({ name: "", age: "", gender: "", dob: "" });
            setAddingNew(false);
        } catch (err) {
            console.error("Save failed:", err);
            setError("Something went wrong while saving.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this child?"))
            return;

        try {
            await api.delete(`/api/children/${id}`);
            setChildren(children.filter((c) => c.id !== id));
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete child.");
        }
    };
    if (!Array.isArray(children)) {
        return (
            <p className="text-center">No children found or data is invalid.</p>
        );
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4 text-center">Children List</h2>
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {children.map((child) => (
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
                                    child.name
                                )}
                            </td>
                            <td>
                                {editingId === child.id ? (
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                ) : (
                                    child.age
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
                                        <option value="Female">Female</option>
                                    </select>
                                ) : (
                                    child.gender
                                )}
                            </td>
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
                                                    age: "",
                                                    gender: "",
                                                    dob: "",
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
                                            onClick={() => handleEdit(child)}
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
                </tbody>
            </table>
        </div>
    );
};

export default ChildrenList;
