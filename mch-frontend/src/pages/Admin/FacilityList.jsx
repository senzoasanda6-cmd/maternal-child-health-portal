import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Modal, Button, Form } from "react-bootstrap";
import Spinner from "../../components/spinners/Spinner";

import AppPageLoading from "../../components/spinners/AppPageLoading";
import AppLoadError from "../../components/spinners/AppLoadError";

const FacilityList = () => {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingFacility, setEditingFacility] = useState(null);
    const [formData, setFormData] = useState({ name: "", location: "" });

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/api/admin/facilities");
            setFacilities(res.data);
        } catch (err) {
            setError("Failed to load facilities. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (hospital = null) => {
        setEditingFacility(hospital);
        setFormData(
            hospital ? { name: hospital.name, location: hospital.location } : { name: "", location: "" }
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingFacility(null);
        setError("");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError("");

        const apiCall = editingFacility
            ? api.put(`/api/admin/facilities/${editingFacility.id}`, formData)
            : api.post("/api/admin/facilities", formData);

        try {
            const res = await apiCall;
            if (editingFacility) {
                setFacilities(facilities.map((h) => (h.id === editingFacility.id ? res.data : h)));
            } else {
                setFacilities([...facilities, res.data]);
            }
            handleCloseModal();
        } catch (err) {
            const message = err.response?.data?.message || `Failed to ${editingFacility ? "update" : "create"} hospital.`;
            setError(message);
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this hospital?")) {
            try {
                await api.delete(`/api/admin/facilities/${id}`);
                setFacilities(facilities.filter((h) => h.id !== id));
            } catch (err) {
                alert("Failed to delete hospital.");
                console.error(err);
            }
        }
    };

    return (
        <div className="container p-4 space-y-6">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Facility Management</h2>
                <Button variant="primary" onClick={() => handleShowModal()}>
                    Add New Facility
                </Button>
            </div>

            {loading && <AppPageLoading loadingText="Loading facilities..."/>}
            {error && !showModal && <AppLoadError message={error} />}

            {!loading && !error && (
                <ul className="list-group">
                    {facilities.map((facility) => (
                        <li key={facility.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{facility.name}</strong> — {facility.location}
                            </div>
                            <div>
                                <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleShowModal(facility)}>
                                    Edit
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(facility.id)}>
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingFacility ? "Edit Hospital" : "Add New Hospital"}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && <p className="text-danger">{error}</p>}
                        <Form.Group className="mb-3">
                            <Form.Label>Facility Name</Form.Label>
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

export default FacilityList;
