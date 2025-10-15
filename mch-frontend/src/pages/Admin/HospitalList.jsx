import React, { useEffect, useState } from "react";
import api from "../../services/api";

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newHospital, setNewHospital] = useState({ name: "", location: "" });

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get("/api/admin/hospitals");
        setHospitals(res.data);
      } catch (err) {
        setError("Failed to load hospitals.");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await api.post("/api/admin/hospitals", newHospital);
      setHospitals((prev) => [...prev, res.data]);
      setNewHospital({ name: "", location: "" });
    } catch (err) {
      alert("Failed to create hospital.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="mb-4">Hospital Management</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Hospital Name"
          value={newHospital.name}
          onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newHospital.location}
          onChange={(e) => setNewHospital({ ...newHospital, location: e.target.value })}
          className="form-control mb-2"
        />
        <button onClick={handleCreate} className="btn btn-primary">
          Add Hospital
        </button>
      </div>

      {loading ? (
        <p>Loading hospitals...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <ul className="list-group">
          {hospitals.map((hospital) => (
            <li key={hospital.id} className="list-group-item d-flex justify-content-between">
              <div>
                <strong>{hospital.name}</strong> — {hospital.location}
              </div>
              {/* Optional: Add edit/delete buttons here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HospitalList;
