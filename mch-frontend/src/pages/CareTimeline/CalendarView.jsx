import React, { useEffect, useState, useCallback, useContext } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import api from "../../services/api";
import EventModal from "./EventModal";
import { RRule, Frequency } from "rrule";
import { AuthContext } from "../../contexts/AuthContext";
import {
    Form,
    Row,
    Col,
    Card,
    Button,
    ButtonGroup,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// Tooltip component
const EventWithTooltip = ({ event, title }) => {
    const renderTooltip = (props) => (
        <Tooltip id={`tooltip-${event.id}`} {...props}>
            <strong>{event.title}</strong>
            <br />
            {moment(event.start).format("LT")} -{" "}
            {moment(event.end).format("LT")}
            {event.extendedProps?.facilityName && (
                <>
                    <br />
                    Location: {event.extendedProps.facilityName}
                </>
            )}
            {event.extendedProps?.status && (
                <>
                    <br />
                    Status: {event.extendedProps.status}
                </>
            )}
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="top" overlay={renderTooltip}>
            <span>{title}</span>
        </OverlayTrigger>
    );
};

// Custom toolbar
const CustomToolbar = ({
    label,
    view,
    views,
    onNavigate,
    onView,
    filters,
    setFilters,
    facilities,
    handleCreateNewEvent,
}) => (
    <Card className="rounded-4 shadow-sm mb-4">
        <Card.Body>
            <Row className="align-items-center mb-3">
                <Col md={4}>
                    <h2 className="mb-0">📅 {label}</h2>
                </Col>
                <Col
                    md={8}
                    className="d-flex justify-content-end align-items-center"
                >
                    <Button
                        variant="success"
                        className="me-3"
                        onClick={handleCreateNewEvent}
                    >
                        + New Event
                    </Button>
                    <ButtonGroup className="me-3">
                        <Button onClick={() => onNavigate("PREV")}>Back</Button>
                        <Button onClick={() => onNavigate("TODAY")}>
                            Today
                        </Button>
                        <Button onClick={() => onNavigate("NEXT")}>Next</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        {views.map((viewName) => (
                            <Button
                                key={viewName}
                                variant={
                                    view === viewName
                                        ? "primary"
                                        : "outline-primary"
                                }
                                onClick={() => onView(viewName)}
                            >
                                {viewName.charAt(0).toUpperCase() +
                                    viewName.slice(1)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>
            <Row className="align-items-center">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Care Type</Form.Label>
                        <Form.Select
                            value={filters.careType}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    careType: e.target.value,
                                })
                            }
                        >
                            <option value="all">All Care Types</option>
                            <option value="prenatal">Prenatal</option>
                            <option value="postnatal">Postnatal</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Clinic</Form.Label>
                        <Form.Select
                            value={filters.clinic}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    clinic: e.target.value,
                                })
                            }
                        >
                            <option value="all">All Clinics</option>
                            {facilities.map((facility) => (
                                <option key={facility.id} value={facility.id}>
                                    {facility.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    status: e.target.value,
                                })
                            }
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </Card.Body>
    </Card>
);

const CalendarView = () => {
    const { user } = useContext(AuthContext);
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [view, setView] = useState(Views.MONTH);
    const [facilities, setFacilities] = useState([]);
    const [filters, setFilters] = useState({
        careType: "all",
        clinic: "all",
        status: "all",
    });

    // Fetch events and facilities
    const fetchEvents = useCallback(async () => {
        try {
            const res = await api.get("/events");
            const formattedEvents = res.data.map((event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                extendedProps: {
                    careType: event.care_type,
                    facilityId: event.facility_id,
                    facilityName: event.facility_name,
                    status: event.status,
                    recurrence: event.recurrence,
                    recurrenceDays: event.recurrence_days,
                },
            }));
            setAllEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to load events:", error);
        }
    }, []);

    useEffect(() => {
        fetchEvents();

        const fetchFacilities = async () => {
            try {
                const res = await api.get("/facilities");
                setFacilities(res.data);
            } catch (error) {
                console.error("Failed to load facilities:", error);
            }
        };
        fetchFacilities();
    }, [fetchEvents]);

    // Filter and process recurring events
    useEffect(() => {
        let events = allEvents.filter((event) => {
            const careTypeMatch =
                filters.careType === "all" ||
                event.extendedProps?.careType === filters.careType;
            const clinicMatch =
                filters.clinic === "all" ||
                event.extendedProps?.facilityId === parseInt(filters.clinic);
            const statusMatch =
                filters.status === "all" ||
                event.extendedProps?.status === filters.status;
            return careTypeMatch && clinicMatch && statusMatch;
        });

        const processedEvents = events.flatMap((event) => {
            if (
                event.extendedProps?.recurrence &&
                event.extendedProps.recurrence !== "none"
            ) {
                const rule = new RRule({
                    freq: Frequency[
                        event.extendedProps.recurrence.toUpperCase()
                    ],
                    dtstart: new Date(event.start),
                    until: new Date(
                        moment(event.start).add(1, "year").format()
                    ),
                    byweekday: event.extendedProps.recurrenceDays,
                });
                return rule.all().map((date) => ({
                    ...event,
                    start: new Date(date),
                    end: new Date(
                        moment(date).add(
                            moment(event.end).diff(moment(event.start))
                        )
                    ),
                }));
            }
            return event;
        });

        setFilteredEvents(processedEvents);
    }, [allEvents, filters]);

    // Event handlers
    const handleSelectSlot = ({ start }) => {
        setSelectedEvent({ start, end: moment(start).add(1, "hour").toDate() });
        setShowModal(true);
    };

    const handleCreateNewEvent = () => {
        setSelectedEvent({
            start: new Date(),
            end: moment(new Date()).add(1, "hour").toDate(),
        });
        setShowModal(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleEventDrop = async ({ event, start, end }) => {
        const updatedEvent = { ...event, start, end };
        try {
            await api.put(`/events/${event.id}`, updatedEvent);
            setAllEvents((prev) =>
                prev.map((e) => (e.id === event.id ? updatedEvent : e))
            );
        } catch (error) {
            console.error("Failed to update event:", error);
        }
    };

    const handleSave = async (eventData) => {
        try {
            if (eventData.id) {
                const res = await api.put(`/events/${eventData.id}`, eventData);
                const updatedEvent = {
                    ...res.data,
                    start: new Date(res.data.start),
                    end: new Date(res.data.end),
                };
                setAllEvents((prev) =>
                    prev.map((e) => (e.id === eventData.id ? updatedEvent : e))
                );
            } else {
                const res = await api.post("/events", eventData);
                const newEvent = {
                    ...res.data,
                    start: new Date(res.data.start),
                    end: new Date(res.data.end),
                };
                setAllEvents((prev) => [...prev, newEvent]);
            }
            setShowModal(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Failed to save event:", error);
        }
    };

    const handleDelete = async (eventId) => {
        try {
            await api.delete(`/events/${eventId}`);
            setAllEvents((prev) => prev.filter((e) => e.id !== eventId));
            setShowModal(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Failed to delete event:", error);
        }
    };

    // Event styling
    const eventStyleGetter = (event) => {
        let color = "#0d6efd"; // default
        if (event.extendedProps?.careType === "prenatal") color = "#6f42c1";
        if (event.extendedProps?.careType === "postnatal") color = "#0d6efd";
        if (event.extendedProps?.status === "pending") color = "#ffc107";
        if (event.extendedProps?.status === "cancelled") color = "#6c757d";
        return {
            style: {
                backgroundColor: color,
                borderRadius: "6px",
                color: "white",
                border: "0px",
                padding: "4px",
            },
        };
    };

    const draggableAccessor = useCallback(
        (event) => {
            const draggableRoles = [
                "admin",
                "health_worker",
                "midwife",
                "facility_worker",
                "facility_nurse",
                "facility_doctor",
            ];
            return draggableRoles.includes(user?.role);
        },
        [user]
    );

    return (
        <div className="container-fluid p-4">
            <Card className="rounded-4 shadow-sm">
                <Card.Body>
                    <DnDCalendar
                        localizer={localizer}
                        events={filteredEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 700 }}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        onEventDrop={handleEventDrop}
                        draggableAccessor={draggableAccessor}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            event: EventWithTooltip,
                            toolbar: (toolbarProps) => (
                                <CustomToolbar
                                    {...toolbarProps}
                                    filters={filters}
                                    setFilters={setFilters}
                                    facilities={facilities}
                                    handleCreateNewEvent={handleCreateNewEvent}
                                />
                            ),
                        }}
                        view={view}
                        onView={setView}
                        views={[
                            Views.MONTH,
                            Views.WEEK,
                            Views.WORK_WEEK,
                            Views.DAY,
                        ]}
                    />
                </Card.Body>
            </Card>

            {showModal && (
                <EventModal
                    show={showModal}
                    handleClose={() => {
                        setShowModal(false);
                        setSelectedEvent(null);
                    }}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    event={selectedEvent}
                    facilities={facilities}
                />
            )}
        </div>
    );
};

export default CalendarView;
