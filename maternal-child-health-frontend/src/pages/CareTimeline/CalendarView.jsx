import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap5";
import api from "../../services/api"; // Adjust path if needed
import { useNavigate } from "react-router-dom";

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        const colorizedEvents = res.data.map((event) => {
          let backgroundColor = "#0d6efd"; // default blue

          // Color by location
          if (event.extendedProps?.location === "Clinic A") {
            backgroundColor = "#198754"; // green
          } else if (event.extendedProps?.location === "Clinic B") {
            backgroundColor = "#dc3545"; // red
          }

          // Color by status (if available)
          if (event.extendedProps?.status === "pending") {
            backgroundColor = "#ffc107"; // yellow
          } else if (event.extendedProps?.status === "cancelled") {
            backgroundColor = "#6c757d"; // gray
          }

          return {
            ...event,
            backgroundColor,
            borderColor: backgroundColor,
          };
        });

        setEvents(colorizedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    navigate(`/book-postnatal?date=${selectedDate}`);
  };

  const handleEventClick = (info) => {
    const { title, start, extendedProps } = info.event;
    const bookingId = extendedProps.bookingId;

    const confirmed = window.confirm(
      `Reschedule appointment for ${title}?\nDate: ${start.toLocaleString()}\nLocation: ${extendedProps.location}`
    );

    if (confirmed) {
      navigate(`/reschedule-booking/${bookingId}`);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">📅 Care Calendar</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, bootstrapPlugin]}
            initialView="dayGridMonth"
            themeSystem="bootstrap5"
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={events}
            height="auto"
            weekends={false}
            validRange={{
              start: new Date().toISOString().split("T")[0],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
