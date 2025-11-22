import React, {
    useEffect,
    useState,
    useCallback,
    useContext,
    useMemo,
} from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
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

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

/* ---------------------------------------------
   EVENT TOOLTIP (cleaned)
------------------------------------------------*/
const EventWithTooltip = ({ event, title }) => {
    const renderTooltip = (props) => {
        const propsObj = event.extendedProps || {};
        return (
            <Tooltip id={`tooltip-${event.id}`} {...props}>
                <strong>{event.title}</strong>
                <br />
                {moment(event.start).format("LT")} –{" "}
                {moment(event.end).format("LT")}
                {propsObj.facilityName && (
                    <>
                        <br />
                        Location: {propsObj.facilityName}
                    </>
                )}
                {propsObj.childName && (
                    <>
                        <br />
                        Child: {propsObj.childName}
                    </>
                )}
                {propsObj.motherName && (
                    <>
                        <br />
                        Mother: {propsObj.motherName}
                    </>
                )}
                {propsObj.healthWorker && (
                    <>
                        <br />
                        Health Worker: {propsObj.healthWorker}
                    </>
                )}
                {propsObj.status && (
                    <>
                        <br />
                        Status: <strong>{propsObj.status}</strong>
                    </>
                )}
                {propsObj.notes && (
                    <>
                        <br />
                        Notes: {propsObj.notes}
                    </>
                )}
            </Tooltip>
        );
    };

    return (
        <OverlayTrigger placement="top" overlay={renderTooltip}>
            <span>{title}</span>
        </OverlayTrigger>
    );
};

/* ---------------------------------------------
   CUSTOM TOOLBAR (clean but unchanged UI)
------------------------------------------------*/
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
                <Col md={8} className="d-flex justify-content-end">
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
                        {views.map((v) => (
                            <Button
                                key={v}
                                variant={
                                    view === v ? "primary" : "outline-primary"
                                }
                                onClick={() => onView(v)}
                            >
                                {v[0].toUpperCase() + v.slice(1)}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Col>
            </Row>

            {/* Filters */}
            <Row>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Care Type</Form.Label>
                        <Form.Select
                            value={filters.careType}
                            onChange={(e) =>
                                setFilters((f) => ({
                                    ...f,
                                    careType: e.target.value,
                                }))
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
                                setFilters((f) => ({
                                    ...f,
                                    clinic: e.target.value,
                                }))
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
                                setFilters((f) => ({
                                    ...f,
                                    status: e.target.value,
                                }))
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

/* ---------------------------------------------
   MAIN COMPONENT (refactored + optimized)
------------------------------------------------*/
const CalendarView = () => {
    const { user } = useContext(AuthContext);

    const [allEvents, setAllEvents] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [visibleRange, setVisibleRange] = useState({
        start: moment().startOf("month").toDate(),
        end: moment().endOf("month").toDate(),
    });
    const [filters, setFilters] = useState({
        careType: "all",
        clinic: "all",
        status: "all",
    });

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [view, setView] = useState(Views.MONTH);
    const [loading, setLoading] = useState(true);

    /* ---------------------------------------------
       FETCH EVENTS (cleaned & unchanged logic)
    ------------------------------------------------*/
    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true);

            const startDate = moment(visibleRange.start)
                .subtract(1, "month")
                .format("YYYY-MM-DD");
            const endDate = moment(visibleRange.end)
                .add(1, "month")
                .format("YYYY-MM-DD");

            const [eventsRes, appointmentsRes, facilitiesRes] =
                await Promise.all([
                    api.get("/events"),
                    api.get(
                        `/appointments?per_page=200&start_date=${startDate}&end_date=${endDate}`
                    ),
                    api.get("/facilities"),
                ]);

            const formattedEvents = (eventsRes.data || []).map((ev) => ({
                ...ev,
                type: "event",
                start: new Date(ev.start),
                end: new Date(ev.end),
                extendedProps: {
                    careType: ev.care_type,
                    facilityId: ev.facility_id,
                    facilityName: ev.facility_name,
                    status: ev.status,
                    recurrence: ev.recurrence,
                    recurrenceDays: ev.recurrence_days,
                },
            }));

            const appointmentsData =
                appointmentsRes.data?.data || appointmentsRes.data || [];

            const formattedAppointments = appointmentsData.map((apt) => {
                const dateStr = new Date(apt.date).toISOString().split("T")[0];
                return {
                    ...apt,
                    type: "appointment",
                    id: `apt_${apt.id}`,
                    originalId: apt.id,
                    title:
                        apt.type ||
                        `${
                            apt.phase?.charAt(0).toUpperCase() +
                            apt.phase?.slice(1)
                        } Appointment`,
                    start: new Date(`${dateStr}T${apt.start_time}`),
                    end: new Date(`${dateStr}T${apt.end_time}`),
                    extendedProps: {
                        careType: apt.phase,
                        facilityId: apt.facility_id,
                        facilityName: apt.facility?.name || "Unknown",
                        status: apt.status,
                        childName: apt.child?.name,
                        motherName: apt.user?.name,
                        healthWorker: apt.health_worker?.name,
                        notes: apt.notes,
                    },
                };
            });

            setAllEvents([...formattedEvents, ...formattedAppointments]);
            setFacilities(facilitiesRes.data);
        } finally {
            setLoading(false);
        }
    }, [visibleRange]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    /* ---------------------------------------------
       FILTER + RECURRENCE (memoized + optimized)
    ------------------------------------------------*/
    const filteredEvents = useMemo(() => {
        const filtered = allEvents.filter((ev) => {
            const props = ev.extendedProps || {};
            const careMatch =
                filters.careType === "all" ||
                props.careType === filters.careType;
            const clinicMatch =
                filters.clinic === "all" ||
                props.facilityId === parseInt(filters.clinic);
            const statusMatch =
                filters.status === "all" || props.status === filters.status;
            return careMatch && clinicMatch && statusMatch;
        });

        /* ----- Recurrence generation only inside visible range ----- */
        return filtered.flatMap((ev) => {
            const props = ev.extendedProps || {};
            if (!props.recurrence || props.recurrence === "none") return ev;

            const freq = Frequency[props.recurrence.toUpperCase()];
            const byweekday =
                props.recurrenceDays?.map((d) => RRule[d]) || undefined;

            const rule = new RRule({
                freq,
                dtstart: ev.start,
                until: visibleRange.end,
                byweekday,
            });

            const duration = ev.end - ev.start;

            return rule
                .between(visibleRange.start, visibleRange.end, true)
                .map((date) => ({
                    ...ev,
                    start: new Date(date),
                    end: new Date(date.getTime() + duration),
                }));
        });
    }, [allEvents, filters, visibleRange]);

    /* ---------------------------------------------
       EVENT HANDLERS (clean)
    ------------------------------------------------*/
    const handleSelectSlot = useCallback(({ start }) => {
        setSelectedEvent({
            start,
            end: moment(start).add(1, "hour").toDate(),
        });
        setShowModal(true);
    }, []);

    const handleSelectEvent = useCallback((ev) => {
        setSelectedEvent(ev);
        setShowModal(true);
    }, []);

    const handleCreateNewEvent = () => {
        setSelectedEvent({
            start: new Date(),
            end: moment().add(1, "hour").toDate(),
        });
        setShowModal(true);
    };

    const handleEventDrop = async ({ event, start, end }) => {
        try {
            if (event.type === "appointment") {
                await api.put(`/appointments/${event.originalId}`, {
                    ...event,
                    start_time: moment(start).format("HH:mm:ss"),
                    end_time: moment(end).format("HH:mm:ss"),
                });
            } else {
                await api.put(`/events/${event.id}`, {
                    ...event,
                    start,
                    end,
                });
            }

            setAllEvents((prev) =>
                prev.map((e) => (e.id === event.id ? { ...e, start, end } : e))
            );
        } catch (err) {
            console.error("Failed to update event:", err);
        }
    };

    const handleSave = async (data) => {
        try {
            if (data.id) {
                const res = await api.put(`/events/${data.id}`, data);
                const updated = {
                    ...res.data,
                    start: new Date(res.data.start),
                    end: new Date(res.data.end),
                };
                setAllEvents((evs) =>
                    evs.map((e) => (e.id === data.id ? updated : e))
                );
            } else {
                const res = await api.post("/events", data);
                const newEvent = {
                    ...res.data,
                    start: new Date(res.data.start),
                    end: new Date(res.data.end),
                };
                setAllEvents((evs) => [...evs, newEvent]);
            }
            setShowModal(false);
        } catch (err) {
            console.error("Failed to save:", err);
        }
    };

    const handleDelete = async (id) => {
        await api.delete(`/events/${id}`);
        setAllEvents((evs) => evs.filter((e) => e.id !== id));
        setShowModal(false);
    };

    /* ---------------------------------------------
       DRAG-ALLOWED ROLES (memoized)
    ------------------------------------------------*/
    const draggableAccessor = useCallback(
        () =>
            [
                "admin",
                "health_worker",
                "midwife",
                "facility_worker",
                "facility_nurse",
                "facility_doctor",
            ].includes(user?.role),
        [user]
    );

    /* ---------------------------------------------
       EVENT COLORS (memoized)
    ------------------------------------------------*/
    const eventStyleGetter = useCallback((event) => {
        const props = event.extendedProps || {};
        const care = props.careType;
        const status = props.status;

        let color = "#0d6efd";
        if (care === "prenatal") color = "#6f42c1";
        if (care === "postnatal") color = "#0d6efd";
        if (care === "vaccination") color = "#198754";

        if (status === "pending") color = "#ffc107";
        if (status === "cancelled") color = "#6c757d";
        if (status === "completed") color = "#198754";

        return {
            style: {
                backgroundColor: color,
                borderRadius: "6px",
                color: "white",
                border:
                    event.type === "appointment" ? "3px solid #ff6b6b" : "none",
                padding: "4px",
                fontWeight: event.type === "appointment" ? "bold" : "normal",
            },
        };
    }, []);

    /* ---------------------------------------------
       RENDER
    ------------------------------------------------*/
    return (
        <div className="container-fluid p-4">
            {loading && (
                <div className="alert alert-info">
                    Loading calendar events and appointments…
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
                            toolbar: (props) => (
                                <CustomToolbar
                                    {...props}
                                    filters={filters}
                                    setFilters={setFilters}
                                    facilities={facilities}
                                    handleCreateNewEvent={handleCreateNewEvent}
                                />
                            ),
                        }}
                        view={view}
                        onView={setView}
                        onRangeChange={(range) => {
                            // Normalize range for all views
                            const start = range.start || range[0];
                            const end = range.end || range[range.length - 1];
                            setVisibleRange({ start, end });
                        }}
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
                    event={selectedEvent}
                    handleClose={() => setShowModal(false)}
                    handleSave={handleSave}
                    handleDelete={handleDelete}
                    facilities={facilities}
                />
            )}
        </div>
    );
};

export default CalendarView;
