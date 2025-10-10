import React from 'react';
import NotificationItem from './NotificationItem';

const NotificationList = ({ notifications }) => {
  return (
    <div className="position-absolute top-100 end-0 mt-2 me-3" style={{ width: '320px', zIndex: 1050 }}>
      <div className="card border-0 shadow-lg">
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0">Notifications</h6>
        </div>
        <div className="card-body p-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <p className="text-center text-muted py-2">No new notifications</p>
          ) : (
            notifications.map((note, index) => (
              <NotificationItem key={index} message={note.message} time={note.time} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;