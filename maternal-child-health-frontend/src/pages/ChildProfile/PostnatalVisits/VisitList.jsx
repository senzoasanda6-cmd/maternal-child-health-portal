import React from "react";

const VisitList = ({ visits }) => {
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Postnatal Visit History</h2>

      {visits && visits.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Child Name</th>
                <th>Visit Type</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit, index) => (
                <tr key={index}>
                  <td>{visit.date}</td>
                  <td>{visit.childName}</td>
                  <td>{visit.type}</td>
                  <td>{visit.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted text-center">No visits recorded yet.</p>
      )}
    </div>
  );
};

export default VisitList;
