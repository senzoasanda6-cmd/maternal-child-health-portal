import React from 'react';
import { NavLink } from 'react-router-dom';
import "./styles.css";

const Sidebar = ({ role = 'mother' }) => {
  const normalizedRole = role.toLowerCase();

  const routesByRole = {
    mother: [
      { label: 'Dashboard', path: '/mother/dashboard' },
      { label: 'My Profile', path: '/mother/child-profile' },
      { label: 'Children', path: '/mother/children' },
      { label: 'Appointments', path: '/mother/calendar' },
      { label: 'Care Timeline', path: '/mother/care-timeline' },
      { label: 'Postnatal Care', path: '/mother/postnatal-care' },
      { label: 'Pregnancy Stages', path: '/mother/pregnancy-stages' },
      { label: 'Safe Medicines', path: '/mother/safe-medicines' },
    ],
    health: [
      { label: 'Dashboard', path: '/health/dashboard' },
      { label: 'Appointments', path: '/health/calendar' },
      { label: 'Care Timeline', path: '/health/care-timeline' },
      { label: 'Postnatal Care', path: '/health/postnatal-care' },
      { label: 'Pregnancy Stages', path: '/health/pregnancy-stages' },
      { label: 'Safe Medicines', path: '/health/safe-medicines' },
    ],
    admin: [
      { label: 'Admin Dashboard', path: '/admin/dashboard' },
    ],
  };

  const links = routesByRole[normalizedRole] || [];

  const getLinkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? 'active-link' : ''}`;

  return (
    <aside className="sidebar">
      <h2>Navigation</h2>
      <ul>
        {links.map(link => (
          <li key={link.path}>
            <NavLink to={link.path} className={getLinkClass}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
