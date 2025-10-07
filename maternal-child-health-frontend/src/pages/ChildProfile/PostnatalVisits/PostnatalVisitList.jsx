import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostnatalVisitList= ({ childId }) => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    const fetchVisits = async () => {
      const response = await axios.get(`/api/children/${childId}/postnatal-visits`);
      setVisits(response.data);
    };
    fetchVisits();
  }, [childId]);

  return (
    <ul>
      {visits.map(v => (
        <li key={v.id}>
          <strong>{v.visit_date}</strong>: {v.notes || 'No notes'}
        </li>
      ))}
    </ul>
  );
};

export default PostnatalVisitList;
