import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

const AppointmentsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const existingAppointment = location.state?.appointment || null;

    const [children, setChildren] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [healthWorkers, setHealthWorkers] = useState([]);

    const [form, setForm] = useState({
        childId: existingAppointment?.extendedProps?.childId || "",
        motherName: existingAppointment?.extendedProps?.motherName || "",
        facilityId: existingAppointment?.extendedProps?.facilityId || "",
        healthWorkerId:
            existingAppointment?.extendedProps?.healthWorkerId || "",
        type: existingAppointment?.title || "",
        start: existingAppointment?.start || new Date(),
        end: existingAppointment?.end || new Date(),
        status: existingAppointment?.extendedProps?.status || "pending",
        notes: existingAppointment?.extendedProps?.notes || "",
    });

    // Fetch dropdown data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [childrenRes, facilitiesRes, hwRes] = await Promise.all([
                    api.get("/children"),
                    api.get("/facilities"),
                    api.get("/health-workers"),
                ]);
                setChildren(childrenRes.data || []);
                setFacilities(facilitiesRes.data || []);
                setHealthWorkers(hwRes.data || []);
            } catch (err) {
                console.error("Error fetching form data:", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                child_id: form.childId,
                mother_name: form.motherName,
                facility_id: form.facilityId,
                health_worker_id: form.healthWorkerId,
                type: form.type,
                date: form.start.toISOString().split("T")[0],
                start_time: form.start.toISOString().split("T")[1],
                end_time: form.end.toISOString().split("T")[1],
                status: form.status,
                notes: form.notes,
            };

            if (existingAppointment) {
                await api.put(
                    `/appointments/${existingAppointment.originalId}`,
                    payload
                );
            } else {
                await api.post("/appointments", payload);
            }

            navigate("/calendar"); // Navigate back to calendar after save
        } catch (err) {
            console.error("Failed to save appointment:", err);
        }
    };

    return (
        <Card className="p-4 shadow-sm rounded-4">
            <h3>
                {existingAppointment ? "Edit Appointment" : "New Appointment"}
            </h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Child</Form.Label>
                            <Form.Select
                                name="childId"
                                value={form.childId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Child</option>
                                {children.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Mother Name</Form.Label>
                            <Form.Control
                                name="motherName"
                                value={form.motherName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Facility</Form.Label>
                            <Form.Select
                                name="facilityId"
                                value={form.facilityId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Facility</option>
                                {facilities.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Health Worker</Form.Label>
                            <Form.Select
                                name="healthWorkerId"
                                value={form.healthWorkerId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Health Worker</option>
                                {healthWorkers.map((hw) => (
                                    <option key={hw.id} value={hw.id}>
                                        {hw.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Start Time</Form.Label>
                            <DateTimePicker
                                onChange={(date) =>
                                    setForm((f) => ({ ...f, start: date }))
                                }
                                value={form.start}
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>End Time</Form.Label>
                            <DateTimePicker
                                onChange={(date) =>
                                    setForm((f) => ({ ...f, end: date }))
                                }
                                value={form.end}
                                className="form-control"
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {existingAppointment
                        ? "Update Appointment"
                        : "Create Appointment"}
                </Button>
            </Form>
        </Card>
    );
};

export default AppointmentsForm;
