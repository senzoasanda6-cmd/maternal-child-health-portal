import React from "react";

const UpcomingAppointmentsCard = ({ appointments = [] }) => {
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-warning text-dark">Upcoming Appointments</div>
      <div className="card-body">
        {appointments.length === 0 ? (
          <p className="text-muted">No upcoming appointments.</p>
        ) : (
          <ul className="list-group list-group-flush">
            {appointments.map((appt, index) => (
              <li key={index} className="list-group-item">
                <strong>{appt.date}</strong> — {appt.type}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UpcomingAppointmentsCard;
