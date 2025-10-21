import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import Spinner from "../../components/spinners/Spinner";

const HospitalList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingHospital, setEditingHospital] = useState(null);
    const [formData, setFormData] = useState({ name: "", location: "" });

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/api/admin/hospitals");
            setHospitals(res.data);
        } catch (err) {
            setError("Failed to load hospitals. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (hospital = null) => {
        setEditingHospital(hospital);
        setFormData(
            hospital ? { name: hospital.name, location: hospital.location } : { name: "", location: "" }
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingHospital(null);
        setError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        const apiCall = editingHospital
            ? api.put(`/api/admin/hospitals/${editingHospital.id}`, formData)
            : api.post("/api/admin/hospitals", formData);

        try {
            const res = await apiCall;
            if (editingHospital) {
                setHospitals(hospitals.map((h) => (h.id === editingHospital.id ? res.data : h)));
            } else {
                setHospitals([...hospitals, res.data]);
            }
            handleCloseModal();
        } catch (err) {
            const message = err.response?.data?.message || `Failed to ${editingHospital ? "update" : "create"} hospital.`;
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this hospital?")) {
            try {
                await api.delete(`/api/admin/hospitals/${id}`);
                setHospitals(hospitals.filter((h) => h.id !== id));
            } catch (err) {
                alert("Failed to delete hospital.");
                console.error(err);
            }
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Hospital Management</h2>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    Add New Hospital
                </Button>
            </div>

            {loading && <p>Loading hospitals...</p>}
            {error && !showModal && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <ul className="list-group">
                    {hospitals.map((hospital) => (
                        <li key={hospital.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{hospital.name}</strong> — {hospital.location}
                            </div>
                            <div>
                                <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowModal(hospital)}>
                                    Edit
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(hospital.id)}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingHospital ? "Edit Hospital" : "Add New Hospital"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && <p className="text-danger">{error}</p>}
                        <Form.Group className="mb-3">
                            <Form.Label>Hospital Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                autoFocus
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSaving}>
                            {isSaving ? <Spinner size="sm" /> : "Save Changes"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default HospitalList;
