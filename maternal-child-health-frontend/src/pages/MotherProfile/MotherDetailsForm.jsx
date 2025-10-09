import React from 'react';

const MotherDetailsForm = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Mother Details Form</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" placeholder="Enter full name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <input type="date" className="form-control" />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number</label>
          <input type="tel" className="form-control" placeholder="Enter contact number" />
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea className="form-control" rows="3" placeholder="Enter address"></textarea>
        </div>

        <button type="submit" className="btn btn-success">Save Details</button>
      </form>
    </div>
  );
};

export default MotherDetailsForm;