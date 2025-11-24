/**
 * Dashboard Service - Unified data fetching for dashboard and calendar integration
 * Aggregates appointment, event, and visit data from various endpoints
 */

import api from "./api";
import moment from "moment";

/**
 * Fetch consolidated dashboard data including appointments, events, and visits
 * @param {string|null} childId - Optional child ID to filter appointments
 * @returns {Promise<Object>} Consolidated dashboard data
 */
export const fetchConsolidatedDashboardData = async (childId = null) => {
  try {
    const endpoints = [
      { key: "lastVisit", url: "/dashboard/last-visit" },
      { key: "pregnancyStage", url: "/dashboard/pregnancy-stage" },
      { key: "appointments", url: `/dashboard/appointments${childId ? `?child_id=${childId}` : ""}` },
      { key: "events", url: "/events" },
      { key: "user", url: "/user" },
    ];

    const responses = await Promise.all(
      endpoints.map(({ key, url }) =>
        api
          .get(url)
          .then((res) => ({ key, data: res.data }))
          .catch((err) => ({ key, error: err, data: null }))
      )
    );

    const result = {};
    responses.forEach(({ key, data, error }) => {
      result[key] = data;
      if (error) {
        console.warn(`Failed to fetch ${key}:`, error);
      }
    });

    return result;
  } catch (error) {
    console.error("Consolidated dashboard data fetch failed:", error);
    throw error;
  }
};

/**
 * Transform calendar events into appointment-like format for dashboard display
 * @param {Array} events - Raw calendar events from API
 * @returns {Array} Formatted appointments
 */
export const transformEventsToAppointments = (events = []) => {
  if (!Array.isArray(events)) return [];

  return events
    .filter((event) => event.start && event.end) // Ensure valid date range
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: moment(event.start).format("YYYY-MM-DD"),
      time: moment(event.start).format("HH:mm"),
      endTime: moment(event.end).format("HH:mm"),
      type: event.extendedProps?.careType || "Appointment",
      status: event.extendedProps?.status || "pending",
      facilityName: event.extendedProps?.facilityName,
      notes: event.extendedProps?.notes,
      childName: event.extendedProps?.childName,
      motherName: event.extendedProps?.motherName,
      healthWorker: event.extendedProps?.healthWorker,
      resource: event.resource, // Resource identifier for filtering
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Fetch upcoming appointments from events (next 30 days)
 * @param {Array} events - Raw calendar events
 * @param {number} daysAhead - Number of days to look ahead (default: 30)
 * @returns {Array} Upcoming appointments
 */
export const getUpcomingAppointments = (events = [], daysAhead = 30) => {
  const appointments = transformEventsToAppointments(events);
  const now = moment();
  const futureDate = moment().add(daysAhead, "days");

  return appointments.filter((appt) => {
    const apptDate = moment(appt.date);
    return apptDate.isAfter(now) && apptDate.isBefore(futureDate);
  });
};

/**
 * Get recent visits/appointments (past appointments)
 * @param {Array} events - Raw calendar events
 * @param {number} daysBefore - Number of days to look back (default: 90)
 * @returns {Array} Recent appointments
 */
export const getRecentAppointments = (events = [], daysBefore = 90) => {
  const appointments = transformEventsToAppointments(events);
  const now = moment();
  const pastDate = moment().subtract(daysBefore, "days");

  return appointments
    .filter((appt) => {
      const apptDate = moment(appt.date);
      return apptDate.isBefore(now) && apptDate.isAfter(pastDate);
    })
    .reverse(); // Most recent first
};

/**
 * Get appointments by status
 * @param {Array} events - Raw calendar events
 * @param {string} status - Status to filter by (pending, confirmed, cancelled, completed)
 * @returns {Array} Filtered appointments
 */
export const getAppointmentsByStatus = (events = [], status = "confirmed") => {
  return transformEventsToAppointments(events).filter(
    (appt) => appt.status?.toLowerCase() === status.toLowerCase()
  );
};

/**
 * Get appointments by care type
 * @param {Array} events - Raw calendar events
 * @param {string} careType - Care type to filter by (prenatal, postnatal, vaccination, etc)
 * @returns {Array} Filtered appointments
 */
export const getAppointmentsByCareType = (events = [], careType = "prenatal") => {
  return transformEventsToAppointments(events).filter(
    (appt) => appt.type?.toLowerCase() === careType.toLowerCase()
  );
};

/**
 * Get appointments by facility
 * @param {Array} events - Raw calendar events
 * @param {string} facilityId - Facility ID to filter by
 * @returns {Array} Filtered appointments
 */
export const getAppointmentsByFacility = (events = [], facilityId) => {
  return transformEventsToAppointments(events).filter(
    (appt) => appt.resource === facilityId
  );
};

/**
 * Merge API appointments with calendar events
 * @param {Array} apiAppointments - Appointments from appointments API endpoint
 * @param {Array} events - Events from calendar/events API endpoint
 * @returns {Array} Merged and deduplicated appointments
 */
export const mergeAppointmentsWithEvents = (apiAppointments = [], events = []) => {
  const calendarAppts = transformEventsToAppointments(events);
  const apiAppts = Array.isArray(apiAppointments) ? apiAppointments : [];

  // Create a map of API appointments by date and title for deduplication
  const apptMap = new Map();
  apiAppts.forEach((appt) => {
    const key = `${appt.date || ""}-${appt.type || ""}`;
    apptMap.set(key, appt);
  });

  // Add calendar appointments that don't exist in API appointments
  calendarAppts.forEach((appt) => {
    const key = `${appt.date}-${appt.type}`;
    if (!apptMap.has(key)) {
      apptMap.set(key, appt);
    }
  });

  return Array.from(apptMap.values()).sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
};

/**
 * Format appointment for dashboard display
 * @param {Object} appointment - Appointment object
 * @returns {Object} Formatted appointment
 */
export const formatAppointmentForDisplay = (appointment) => {
  const date = moment(appointment.date);
  const isToday = date.isSame(moment(), "day");
  const isTomorrow = date.isSame(moment().add(1, "day"), "day");

  let displayDate = date.format("MMM DD, YYYY");
  if (isToday) displayDate = "Today";
  if (isTomorrow) displayDate = "Tomorrow";

  return {
    ...appointment,
    displayDate,
    displayTime: appointment.time ? ` at ${appointment.time}` : "",
    displayStatus: appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : "Pending",
    isUpcoming: date.isAfter(moment()),
    isPast: date.isBefore(moment()),
    isToday,
    isTomorrow,
  };
};

/**
 * Get appointment statistics for dashboard
 * @param {Array} events - Raw calendar events
 * @returns {Object} Statistics object
 */
export const getAppointmentStats = (events = []) => {
  const appointments = transformEventsToAppointments(events);
  const now = moment();

  const stats = {
    total: appointments.length,
    upcoming: 0,
    today: 0,
    overdue: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  };

  appointments.forEach((appt) => {
    const apptDate = moment(appt.date);

    // Count upcoming/today/overdue
    if (apptDate.isSame(now, "day")) {
      stats.today++;
    } else if (apptDate.isAfter(now)) {
      stats.upcoming++;
    } else {
      stats.overdue++;
    }

    // Count by status
    const status = appt.status?.toLowerCase();
    if (status === "confirmed") stats.confirmed++;
    else if (status === "pending") stats.pending++;
    else if (status === "cancelled") stats.cancelled++;
  });

  return stats;
};

export default {
  fetchConsolidatedDashboardData,
  transformEventsToAppointments,
  getUpcomingAppointments,
  getRecentAppointments,
  getAppointmentsByStatus,
  getAppointmentsByCareType,
  getAppointmentsByFacility,
  mergeAppointmentsWithEvents,
  formatAppointmentForDisplay,
  getAppointmentStats,
};
