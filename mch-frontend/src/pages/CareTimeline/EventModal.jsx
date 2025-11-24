import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

const EventModal = ({
    show,
    handleClose,
    handleSave,
    handleDelete,
    event,
    facilities = [],
}) => {
    const [title, setTitle] = useState("");
    const [facilityId, setFacilityId] = useState(facilities[0]?.id || null);
    const [status, setStatus] = useState("pending");
    const [careType, setCareType] = useState("postnatal");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    const [recurrence, setRecurrence] = useState("none");
    const [recurrenceDays, setRecurrenceDays] = useState([]);

    useEffect(() => {
        if (event) {
            setTitle(event.title || "");
            setFacilityId(
                event.extendedProps?.facilityId || facilities[0]?.id || null
            );
            setStatus(event.extendedProps?.status || "pending");
            setCareType(event.extendedProps?.careType || "postnatal");
            setStart(event.start ? new Date(event.start) : new Date());
            setEnd(event.end ? new Date(event.end) : new Date());
            setRecurrence(event.extendedProps?.recurrence || "none");
            setRecurrenceDays(event.extendedProps?.recurrenceDays || []);
        }
    }, [event, facilities]);

    const onSave = () => {
        const selectedFacility = facilities.find(
            (f) => f.id === parseInt(facilityId)
        );
        const eventData = {
            ...event,
            title,
            start,
            end,
            extendedProps: {
                ...event?.extendedProps,
                facilityId: parseInt(facilityId),
                facilityName: selectedFacility?.name || "",
                status,
                careType,
                recurrence,
                recurrenceDays,
            },
        };
        handleSave(eventData);
    };

    const onDelete = () => handleDelete(event.id);

    const handleDayToggle = (day) => {
        if (recurrenceDays.includes(day)) {
            setRecurrenceDays(recurrenceDays.filter((d) => d !== day));
        } else {
            setRecurrenceDays([...recurrenceDays, day]);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {event?.id ? "Edit Event" : "Create Event"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Care Type</Form.Label>
                                <Form.Select
                                    value={careType}
                                    onChange={(e) =>
                                        setCareType(e.target.value)
                                    }
                                >
                                    <option value="postnatal">Postnatal</option>
                                    <option value="prenatal">Prenatal</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Clinic</Form.Label>
                                <Form.Select
                                    value={facilityId}
                                    onChange={(e) =>
                                        setFacilityId(e.target.value)
                                    }
                                >
                                    {facilities.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            {f.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Start Time</Form.Label>
                                <DateTimePicker
                                    onChange={setStart}
                                    value={start}
                                    className="w-100"
                                    calendarIcon={null}
                                    clearIcon={null}
                                    disableClock={true} // removes the popup clock
                                    format="h:mm a" // ensures AM/PM is inline
                                />
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>End Time</Form.Label>
                                <DateTimePicker
                                    onChange={setEnd}
                                    value={end}
                                    className="w-100"
                                    calendarIcon={null}
                                    clearIcon={null}
                                    disableClock={true}
                                    format="h:mm a"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Recurrence</Form.Label>
                        <Form.Select
                            value={recurrence}
                            onChange={(e) => setRecurrence(e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </Form.Select>
                    </Form.Group>

                    {recurrence === "weekly" && (
                        <Form.Group className="mb-3">
                            <Form.Label>Repeat on</Form.Label>
                            <div>
                                {["S", "M", "T", "W", "T", "F", "S"].map(
                                    (day, index) => (
                                        <Button
                                            key={index}
                                            variant={
                                                recurrenceDays.includes(index)
                                                    ? "primary"
                                                    : "outline-primary"
                                            }
                                            onClick={() =>
                                                handleDayToggle(index)
                                            }
                                            className="me-1 mb-1"
                                        >
                                            {day}
                                        </Button>
                                    )
                                )}
                            </div>
                        </Form.Group>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                {event?.id && (
                    <Button variant="danger" onClick={onDelete}>
                        Delete
                    </Button>
                )}
                <Button variant="primary" onClick={onSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EventModal;
