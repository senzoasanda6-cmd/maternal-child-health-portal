import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Adjust path if needed
import AppLoading from "../../components/spinners/AppPageLoading";
import { Link } from "react-router-dom";
import AppLoadError from "../../components/spinners/AppLoadError";

const MotherProfile = () => {
    const [mother, setMother] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        contact: "",
        address: "",
        children: [],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/mother-profile"); // Authenticated endpoint
                setMother(res.data);
                setFormData({
                    name: res.data.name,
                    dob: res.data.dob,
                    contact: res.data.contact,
                    address: res.data.address,
                    children: res.data.children || [],
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError("Session expired. Please login again.");
                }

                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChildChange = (index, field, value) => {
        const updatedChildren = [...formData.children];
        updatedChildren[index][field] = value;
        setFormData((prev) => ({ ...prev, children: updatedChildren }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/api/mother-profile", formData);
            alert("Profile updated successfully.");
            setMother(formData);
            setEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <AppLoading loadingText="Loading profile..." />;
    if (error) {
        return (
            <div className="container py-4 text-center">
                <div className="alert alert-danger" role="alert">
                    {error}
                    <br />
                    <Link to="/login" className="btn btn-primary mt-3">Login</Link>
                </div>
            </div>
        );
    }
    if (!mother) return <AppLoadError errorText="Profile not found." />;

    return (
        <div className="container p-4">
            <h2 className="mb-4 text-center">👩🏽 Mother Profile</h2>

            <div className="row">
                <div className="col-md-4">
                    {/* <img src={MotherImage} alt="Mother" className="img-fluid rounded" /> */}
                    <div className="bg-secondary text-white p-4 rounded text-center">
                        Image Placeholder
                    </div>
                </div>

                <div className="col-md-8">
                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    className="form-control"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contact</label>
                                <input
                                    type="text"
                                    name="contact"
                                    className="form-control"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Children</label>
                                {formData.children.map((child, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="form-control mb-2"
                                        value={child}
                                        onChange={(e) =>
                                            handleChildChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <>
                            <h4>{mother.name}</h4>
                            <p>
                                <strong>Date of Birth:</strong> {mother.dob}
                            </p>
                            <p>
                                <strong>Contact:</strong> {mother.contact}
                            </p>
                            <p>
                                <strong>Address:</strong> {mother.address}
                            </p>
                            {formData.children.map((child, index) => (
                                <div key={index} className="mb-3">
                                    <label className="form-label">
                                        Child {index + 1} Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        value={child.name}
                                        onChange={(e) =>
                                            handleChildChange(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <label className="form-label">
                                        Child {index + 1} Birth Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={child.dob}
                                        onChange={(e) =>
                                            handleChildChange(
                                                index,
                                                "dob",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            ))}
                            <ul>
                                {mother.children.map((child, index) => (
                                    <li key={index}>
                                        {child.name} — {child.dob}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="btn btn-warning mt-3"
                                onClick={() => setEditing(true)}
                            >
                                Edit Profile
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MotherProfile;
