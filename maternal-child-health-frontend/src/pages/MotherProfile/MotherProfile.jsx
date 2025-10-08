import React from 'react';
// Uncomment and adjust the path if you have an image to use
// import MotherImage from '../../assets/MotherProfile.jpg';

const MotherProfile = () => {
  const mother = {
    name: 'Nomsa Dlamini',
    dob: '1990-05-12',
    contact: '082 123 4567',
    address: '123 Main Street, Brakpan',
    children: ['Thabo', 'Lerato'],
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Mother Profile</h2>

      <div className="row">
        <div className="col-md-4">
          {/* Uncomment this line if you have the image */}
          {/* <img src={MotherImage} alt="Mother" className="img-fluid rounded" /> */}
          <div className="bg-secondary text-white p-4 rounded text-center">
            Image Placeholder
          </div>
        </div>
        <div className="col-md-8">
          <h4>{mother.name}</h4>
          <p><strong>Date of Birth:</strong> {mother.dob}</p>
          <p><strong>Contact:</strong> {mother.contact}</p>
          <p><strong>Address:</strong> {mother.address}</p>
          <h5>Children:</h5>
          <ul>
            {mother.children.map((child, index) => (
              <li key={index}>{child}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MotherProfile;