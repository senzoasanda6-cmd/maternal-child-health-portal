const cardConfig = {
  mother: [
    {
      title: 'My Profile',
      description: 'View and edit your personal information.',
      buttonText: 'View Profile',
      buttonStyle: 'primary',
      path: '/mother/child-profile'
    },
    {
      title: 'Appointments',
      description: 'Check upcoming visits and schedule new ones.',
      buttonText: 'View Calendar',
      buttonStyle: 'accent',
      path: '/mother/calendar'
    },
    {
      title: 'Vaccination Schedule',
      description: 'Track your child’s upcoming vaccines.',
      buttonText: 'View Schedule',
      buttonStyle: 'primary',
      path: '/mother/vaccinations'
    }
  ],
  health: [
    {
      title: 'Patient Overview',
      description: 'Access child profiles and medical history.',
      buttonText: 'View Children',
      buttonStyle: 'primary',
      path: '/health/child-profile'
    },
    {
      title: 'Appointments',
      description: 'Manage and review scheduled visits.',
      buttonText: 'View Calendar',
      buttonStyle: 'accent',
      path: '/health/calendar'
    },
    {
      title: 'Postnatal Visits',
      description: 'Record and review postnatal care.',
      buttonText: 'View Visits',
      buttonStyle: 'primary',
      path: '/health/postnatal-visits'
    }
  ],
  admin: [
    {
      title: 'Admin Dashboard',
      description: 'Manage users, roles, and system settings.',
      buttonText: 'Go to Admin Panel',
      buttonStyle: 'primary',
      path: '/admin/dashboard'
    }
  ]
};

export default cardConfig;
