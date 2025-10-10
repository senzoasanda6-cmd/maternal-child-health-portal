import React from 'react';

const PreNatalVisit = ({ visit }) => {
  if (!visit) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No visit data available.</p>;

  const containerStyle = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333'
  };

  const detailStyle = {
    marginBottom: '1rem',
    lineHeight: '1.6',
    color: '#555'
  };

  const labelStyle = {
    fontWeight: 'bold',
    color: '#222'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Prenatal Visit Details</h2>
      <p style={detailStyle}><span style={labelStyle}>Date:</span> {visit.visitDate}</p>
      <p style={detailStyle}><span style={labelStyle}>Blood Pressure:</span> {visit.bloodPressure}</p>
      <p style={detailStyle}><span style={labelStyle}>Weight:</span> {visit.weight} kg</p>
      <p style={detailStyle}><span style={labelStyle}>Fetal Heart Rate:</span> {visit.fetalHeartRate} bpm</p>
      <p style={detailStyle}><span style={labelStyle}>Symptoms:</span> {visit.symptoms}</p>
      <p style={detailStyle}><span style={labelStyle}>Lab Tests:</span> {visit.labTests}</p>
      <p style={detailStyle}><span style={labelStyle}>Recommendations:</span> {visit.recommendations}</p>
    </div>
  );
};

export default PreNatalVisit;