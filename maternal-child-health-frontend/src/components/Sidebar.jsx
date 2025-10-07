import React from 'react'
import './styles.css'

const Sidebar = ({ role }) => {
  const links = [
    { label: 'Overview', path: '/' },
    ...(role === 'admin' ? [{ label: 'Hospitals', path: '/hospitals' }] : []),
    ...(role === 'health_worker' ? [{ label: 'My Patients', path: '/patients' }] : []),
  ];

return (
    <nav className="sidebar">
      {links.map(link => (
        <Link key={link.path} to={link.path}>{link.label}</Link>
      ))}
    </nav>
  );
};

export default Sidebar