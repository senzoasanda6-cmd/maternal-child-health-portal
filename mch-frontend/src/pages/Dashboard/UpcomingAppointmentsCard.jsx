import React from "react";
import moment from "moment";
import { Badge } from "react-bootstrap";
import { formatAppointmentForDisplay } from "../../services/dashboardService";

const UpcomingAppointmentsCard = ({ appointments = [] }) => {
  // Filter only upcoming appointments (next 30 days)
  const upcomingAppointments = appointments
    .filter((appt) => {
      const apptDate = moment(appt.date);
      const isWithinNextMonth = apptDate.isBefore(moment().add(30, "days"));
      const isInFuture = apptDate.isAfter(moment().subtract(1, "day"));
      return isInFuture && isWithinNextMonth;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show top 5 upcoming appointments

  const getStatusBadgeVariant = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "completed":
        return "info";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type) => {
    const typeLower = type?.toLowerCase();
    if (typeLower?.includes("vaccine")) return "💉";
    if (typeLower?.includes("prenatal")) return "🤰";
    if (typeLower?.includes("postnatal")) return "👶";
    if (typeLower?.includes("follow")) return "👨‍⚕️";
    return "📋";
  };

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <span>📅 Upcoming Appointments</span>
        <span className="badge bg-dark">{upcomingAppointments.length}</span>
      </div>
      <div className="card-body">
        {upcomingAppointments.length === 0 ? (
          <p className="text-muted mb-0">No upcoming appointments scheduled.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {upcomingAppointments.map((appt, index) => {
              const formatted = formatAppointmentForDisplay(appt);
              return (
                <li
                  key={appt.id || index}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fs-5">{getTypeIcon(appt.type)}</span>
                      <strong>{appt.title || appt.type}</strong>
                      <Badge bg={getStatusBadgeVariant(appt.status)}>
                        {formatted.displayStatus}
                      </Badge>
                    </div>
                    <small className="text-muted d-block">
                      <i className="far fa-calendar-alt"></i> {formatted.displayDate}
                      {formatted.displayTime && ` ${formatted.displayTime}`}
                    </small>
                    {appt.facilityName && (
                      <small className="text-muted d-block">
                        <i className="fas fa-clinic-medical"></i> {appt.facilityName}
                      </small>
                    )}
                    {appt.childName && (
                      <small className="text-muted d-block">
                        <i className="fas fa-child"></i> Child: {appt.childName}
                      </small>
                    )}
                    {appt.healthWorker && (
                      <small className="text-muted d-block">
                        <i className="fas fa-user-md"></i> Provider: {appt.healthWorker}
                      </small>
                    )}
                    {appt.notes && (
                      <small className="text-secondary d-block mt-1">
                        <i className="fas fa-sticky-note"></i> {appt.notes}
                      </small>
                    )}
                  </div>
                  {formatted.isToday && (
                    <span className="badge bg-danger ms-2">TODAY</span>
                  )}
                  {formatted.isTomorrow && (
                    <span className="badge bg-info ms-2">TOMORROW</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointmentsCard;
