import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const SafeMedicines = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const medicines = [
    { name: "Paracetamol", category: "Pregnancy", description: "Approved pain reliever" },
    { name: "Folic Acid", category: "Pregnancy", description: "Essential supplement" },
    { name: "Vitamin D", category: "Pregnancy", description: "Supports bone health" },
    { name: "Amoxicillin", category: "Breastfeeding", description: "Compatible antibiotic" },
    { name: "Cetirizine", category: "Breastfeeding", description: "Safe allergy medication" },
    { name: "Mini-pill", category: "Breastfeeding", description: "Hormonal contraceptive" },
  ];

  const filtered = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">
        <i className="bi bi-capsule me-2"></i>Safe Medicines
      </h1>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search medicines by name, category, or use..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="row">
        {filtered.length > 0 ? (
          filtered.map((med, index) => (
            <div className="col-md-4 mb-3" key={index}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-capsule me-2"></i>{med.name}
                  </h5>
                  <p className="card-text">{med.description}</p>
                  <span className="badge bg-info">{med.category}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No medicines match your search.</p>
          </div>
        )}
      </div>

      <div className="alert alert-warning text-center mt-4">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>Reminder:</strong> Always consult a healthcare provider before taking any medication.
      </div>
    </div>
  );
};

export default SafeMedicines;
