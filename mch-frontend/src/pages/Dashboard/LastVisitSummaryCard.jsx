import React from "react";
import moment from "moment";
import { Badge } from "react-bootstrap";

const LastVisitSummaryCard = ({ visit }) => {
  if (!visit || !visit.visit_date) {
    return (
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-primary text-white">Last Visit Summary</div>
        <div className="card-body">
          <p className="text-muted mb-0">No visit records available.</p>
        </div>
      </div>
    );
  }

  const visitDate = moment(visit.visit_date);
  const daysAgo = moment().diff(visitDate, "days");

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-primary text-white">Last Visit Summary</div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <p className="mb-2">
              <strong>📅 Date:</strong> {visitDate.format("MMMM DD, YYYY")}
              <br />
              <small className="text-muted">({daysAgo} days ago)</small>
            </p>
            <p className="mb-2">
              <strong>📋 Type:</strong>{" "}
              <Badge
                bg={visit.visit_type === "prenatal" ? "info" : "success"}
              >
                {visit.visit_type?.toUpperCase()}
              </Badge>
            </p>
          </div>
          <div className="col-md-6">
            {visit.facility && (
              <p className="mb-2">
                <strong>🏥 Facility:</strong> {visit.facility.name}
                <br />
                <small className="text-muted">{visit.facility.location}</small>
              </p>
            )}
            {visit.provider && (
              <p className="mb-2">
                <strong>👨‍⚕️ Provider:</strong> {visit.provider.name}
              </p>
            )}
          </div>
        </div>

        {visit.notes && (
          <div className="alert alert-light mb-3">
            <strong>📝 Notes:</strong>
            <p className="mb-0">{visit.notes}</p>
          </div>
        )}

        {visit.child && (
          <div className="mb-3">
            <strong>👶 Child Information:</strong>
            <p className="mb-1">
              Name: {visit.child.name} (
              {visit.child.gender?.charAt(0).toUpperCase()})
            </p>
            <p className="mb-0 text-muted">
              DOB: {moment(visit.child.birth_date).format("MMMM DD, YYYY")}
            </p>
          </div>
        )}

        {visit.immunizations && (
          <div>
            <strong>💉 Immunizations:</strong>
            <div className="row mt-2">
              {visit.immunizations.past && visit.immunizations.past.length > 0 && (
                <div className="col-md-4">
                  <h6 className="text-success">Administered</h6>
                  <ul className="small list-unstyled">
                    {visit.immunizations.past.map((vax, idx) => (
                      <li key={idx}>
                        ✅ {vax.vaccine_name} (Dose {vax.dose})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {visit.immunizations.upcoming &&
                visit.immunizations.upcoming.length > 0 && (
                  <div className="col-md-4">
                    <h6 className="text-info">Scheduled</h6>
                    <ul className="small list-unstyled">
                      {visit.immunizations.upcoming.map((vax, idx) => (
                        <li key={idx}>
                          📅 {vax.vaccine_name} (Dose {vax.dose})
                          <br />
                          <small className="text-muted">
                            {moment(vax.scheduled_on).format("MMM DD, YYYY")}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              {visit.immunizations.missed &&
                visit.immunizations.missed.length > 0 && (
                  <div className="col-md-4">
                    <h6 className="text-danger">Missed</h6>
                    <ul className="small list-unstyled">
                      {visit.immunizations.missed.map((vax, idx) => (
                        <li key={idx}>
                          ⚠️ {vax.vaccine_name} (Dose {vax.dose})
                          <br />
                          <small className="text-muted">
                            Was due: {moment(vax.scheduled_on).format("MMM DD")}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastVisitSummaryCard;
