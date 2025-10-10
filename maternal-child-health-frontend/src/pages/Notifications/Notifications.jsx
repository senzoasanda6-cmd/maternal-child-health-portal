import React, { useState } from 'react';
import NotificationBell from './NotificationBell';
import NotificationList from './NotificationList';

const Notifications = () => {
  const [showList, setShowList] = useState(false);

  const notifications = [
    { message: 'New prenatal visit added', time: '2 hours ago' },
    { message: 'Lab results uploaded', time: 'Yesterday' },
    { message: 'Reminder: Next visit in 3 days', time: '3 days ago' }
  ];

  const toggleList = () => setShowList(prev => !prev);

  return (
    <div className="position-relative d-flex align-items-center justify-content-end p-3 bg-light border-bottom">
      <NotificationBell count={notifications.length} onClick={toggleList} />
      {showList && <NotificationList notifications={notifications} />}
    </div>
  );
};

