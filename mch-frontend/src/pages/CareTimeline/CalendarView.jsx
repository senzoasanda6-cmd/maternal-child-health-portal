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

// Tooltip component with appointment details
const EventWithTooltip = ({ event, title }) => {
    const isAppointment = event.type === "appointment";
    const renderTooltip = (props) => (
        <Tooltip id={`tooltip-${event.id}`} {...props}>
            <strong>{event.title}</strong>
            {isAppointment && (
                <>
                    <br />
                    <small>Type: Appointment</small>
                </>
            )}
            <br />
            {moment(event.start).format("LT")} -{" "}
            {moment(event.end).format("LT")}
            {event.extendedProps?.facilityName && (
                <>
                    <br />
                    Location: {event.extendedProps.facilityName}
                </>
            )}
            {event.extendedProps?.childName && (
                <>
                    <br />
                    Child: {event.extendedProps.childName}
                </>
            )}
            {event.extendedProps?.motherName && (
                <>
                    <br />
                    Mother: {event.extendedProps.motherName}
                </>
            )}
            {event.extendedProps?.healthWorker && (
                <>
                    <br />
                    Health Worker: {event.extendedProps.healthWorker}
                </>
            )}
            {event.extendedProps?.status && (
                <>
                    <br />
                    Status: <strong>{event.extendedProps.status}</strong>
                </>
            )}
            {event.extendedProps?.notes && (
                <>
                    <br />
                    Notes: {event.extendedProps.notes}
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
    const [loading, setLoading] = useState(true);

    // Fetch events and facilities
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);
            // Fetch appointments for a window around current month so they appear in calendar
            const startDate = moment().startOf('month').subtract(2, 'months').format('YYYY-MM-DD');
            const endDate = moment().endOf('month').add(2, 'months').format('YYYY-MM-DD');
            const [eventsRes, appointmentsRes, facilitiesRes] = await Promise.all([
                api.get("/events"),
                api.get(`/appointments?per_page=100&start_date=${startDate}&end_date=${endDate}`),
                api.get("/facilities"),
            ]);

            // Format events
            const formattedEvents = (eventsRes.data || []).map((event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                type: "event",
                extendedProps: {
                    careType: event.care_type,
                    facilityId: event.facility_id,
                    facilityName: event.facility_name,
                    status: event.status,
                    recurrence: event.recurrence,
                    recurrenceDays: event.recurrence_days,
                },
            }));

            // Format appointments - handle both direct array and paginated response
            const appointmentsData = appointmentsRes.data?.data || appointmentsRes.data || [];
            const formattedAppointments = appointmentsData.map((apt) => {
                // Parse date and time separately
                const dateStr = apt.date ? new Date(apt.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                const startTime = apt.start_time || '09:00:00';
                const endTime = apt.end_time || '10:00:00';
                
                return {
                    ...apt,
                    id: `apt_${apt.id}`,
                    title: apt.type || `${apt.phase?.charAt(0).toUpperCase() + apt.phase?.slice(1) || 'Appointment'} Appointment`,
                    start: new Date(`${dateStr}T${startTime}`),
                    end: new Date(`${dateStr}T${endTime}`),
                    type: "appointment",
                    extendedProps: {
                        careType: apt.phase,
                        facilityId: apt.facility_id,
                        facilityName: apt.facility?.name || 'Unknown',
                        status: apt.status,
                        healthWorker: apt.health_worker?.name || 'Unassigned',
                        childName: apt.child?.name,
                        motherName: apt.user?.name,
                        notes: apt.notes,
                    },
                };
            });

            setAllEvents([...formattedEvents, ...formattedAppointments]);
            setFacilities(facilitiesRes.data);
            console.log(`Loaded ${formattedEvents.length} events and ${formattedAppointments.length} appointments`);
        } catch (error) {
            console.error("Failed to load calendar data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
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

    // Event styling with type distinction
    const eventStyleGetter = (event) => {
        let color = "#0d6efd"; // default
        const careType = event.extendedProps?.careType;
        const status = event.extendedProps?.status;
        
        // Color by care type
        if (careType === "prenatal") color = "#6f42c1";
        if (careType === "postnatal") color = "#0d6efd";
        if (careType === "vaccination") color = "#198754";
        
        // Override by status
        if (status === "pending") color = "#ffc107";
        if (status === "cancelled") color = "#6c757d";
        if (status === "completed") color = "#198754";
        
        // Visual distinction for appointments
        const isAppointment = event.type === "appointment";
        
        return {
            style: {
                backgroundColor: color,
                borderRadius: "6px",
                color: "white",
                border: isAppointment ? "3px solid #ff6b6b" : "0px",
                padding: "4px",
                fontWeight: isAppointment ? "bold" : "normal",
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
            {loading && (
                <div className="alert alert-info">
                    Loading calendar events and appointments...
                </div>
            )}
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
