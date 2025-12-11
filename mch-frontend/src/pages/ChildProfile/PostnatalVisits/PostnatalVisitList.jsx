import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";

const PostnatalVisitList = ({ childId }) => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get(`/children/${childId}/postnatal-visits`);
        setVisits(response.data);
      } catch (err) {
        setError("Failed to load visits.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisits();
  }, [childId]);

  const filteredVisits = visits.filter(v => {
    const visitDate = new Date(v.visit_date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return (!start || visitDate >= start) && (!end || visitDate <= end);
  });

  const exportToPDF = () => {
    const element = document.getElementById("visit-table");
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("postnatal-visits.pdf");
    });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Postnatal Visit History</h2>

      <button className="btn btn-outline-primary mb-3" onClick={exportToPDF}>
        <i className="bi bi-file-earmark-pdf me-2"></i>Export to PDF
      </button>

      <div className="row mb-3">
        <div className="col-md-6">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Loading visits...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && filteredVisits.length > 0 ? (
        <div id="visit-table">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.map((v) => (
                <tr key={v.id}>
                  <td>
                    <Link to={`/visit/${v.id}`} className="text-decoration-none">
                      {v.visit_date}
                    </Link>
                  </td>
                  <td>{v.notes || "No notes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        !error && (
          <p className="text-muted text-center">No visits recorded yet.</p>
        )
      )}
    </div>
  );
};

export default PostnatalVisitList;
