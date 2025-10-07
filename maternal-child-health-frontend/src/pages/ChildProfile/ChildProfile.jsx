import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VaccinationsHistory from './Vaccinations/VaccinationsHistory';
import PostnatalVisitList from './PostnatalVisits/PostnatalVisitList';
import VaccineProgressChart from './Vaccinations/VaccineProgressChart';

const ChildProfile = ({ childId }) => {
  const [child, setChild] = useState(null);

  useEffect(() => {
    axios.get(`/api/children/${childId}`).then(res => setChild(res.data));
  }, [childId]);

  if (!child) return <p>Loading child profile...</p>;

  return (
    <div className="child-profile">
      <h2>{child.name}</h2>
      <p><strong>Date of Birth:</strong> {new Date(child.dob).toLocaleDateString()}</p>
      <p><strong>Mother ID:</strong> {child.mother_id}</p>
      <p><strong>Hospital ID:</strong> {child.hospital_id}</p>

      <h3>Vaccination History</h3>
      <VaccinationsHistory childId={childId} />

      <h3>Postnatal Visits</h3>
      <PostnatalVisitList childId={childId} />

      <h3>Vaccine Progress</h3>
      <VaccineProgressChart childId={childId} />
    </div>
  );
};

export default ChildProfile;
