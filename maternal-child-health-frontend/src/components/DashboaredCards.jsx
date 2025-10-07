import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from './StatCard'; // adjust path if needed

import './styles.css'

const DashboardCards = ({ role, hospitalId }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const endpoint = role === 'admin'
        ? '/api/admin/hospitals'
        : `/api/health/dashboard`;

      const response = await axios.get(endpoint);
      setStats(response.data);
    };

    fetchStats();
  }, [role, hospitalId]);

  return (
    <div className="dashboard-grid">
      <StatCard title="Patients" value={stats?.patients?.length || 0} />
      <StatCard title="Appointments" value={stats?.appointments?.length || 0} />
      {role === 'admin' && <StatCard title="Hospitals" value={stats?.length || 0} />}
    </div>
  );
};
export default DashboardCards