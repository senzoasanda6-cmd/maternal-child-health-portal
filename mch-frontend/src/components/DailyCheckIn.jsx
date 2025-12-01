import React from 'react';

const DailyCheckIn = ({ userId }) => {
  return (
    <div className="daily-checkin">
      <h4>Daily Check-In</h4>
      <p>Placeholder daily check-in component for user {userId ?? '—'}.</p>
      <p>Replace this stub with the real interactive component.</p>
    </div>
  );
};

export default DailyCheckIn;
