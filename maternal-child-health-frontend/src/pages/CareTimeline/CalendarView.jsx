import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap5";
import api from "../../services/api"; // Adjust path if needed

const CalendarView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events");
        setEvents(res.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    alert(`Clicked on date: ${info.dateStr}`);
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
            events={events}
            height="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
