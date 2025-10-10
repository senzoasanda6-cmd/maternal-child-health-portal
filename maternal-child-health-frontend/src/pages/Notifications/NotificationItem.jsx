import React from 'react';

const NotificationItem = ({ message, time }) => {
  return (
    <div className="card mb-2 shadow-sm">
      <div className="card-body p-3">
        <p className="card-text mb-1">{message}</p>
        <span className="text-muted small">{time}</span>
      </div>
    </div>
  );
};

export default NotificationItem;