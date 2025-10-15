import React from 'react';
import { NavLink } from 'react-router-dom';
import "./_components.css";

const Sidebar = ({ role = 'mother' }) => {
  const normalizedRole = role.toLowerCase();

  const routesByRole = {
    mother: [
      { label: 'Home', path: '/mother/home' },
      { label: 'Dashboard', path: '/mother/dashboard' },
      { label: 'My Profile', path: '/mother/mom-profile' },
      { label: 'My Children', path: '/mother/children' },
      { label: 'Appointments', path: '/mother/calendar' },
      { label: 'Care Timeline', path: '/mother/care-timeline' },
      { label: 'Postnatal Care', path: '/mother/postnatal-care' },
      { label: 'Pregnancy Stages', path: '/mother/pregnancy-stages' },
      { label: 'Safe Medicines', path: '/mother/safe-medicines' },
      { label: 'Health Education', path: '/mother/health-education' },
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
    <aside className="sidebar shadow">
      <h2>Navigation</h2>
      <hr />
      <ul>
        {links.map(link => (
          <li key={link.path}>
            <NavLink to={link.path} className={getLinkClass}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr />
      <div className='pb-2'>
        <p style={{ fontSize: '12px', color: '#666' }}>
          &copy; {new Date().getFullYear()} Maternal Child Health Portal. <a href="mailto:senzo.dubazana@gauteng.gov.za" className="text-primary">Need help?</a>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
