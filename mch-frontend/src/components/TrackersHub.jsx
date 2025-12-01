import React from 'react';

const TrackersHub = ({ userId }) => {
  return (
    <div className="trackers-hub">
      <h4>Trackers Hub</h4>
      <p>Placeholder trackers hub for user {userId ?? '—'}.</p>
      <p>Integrate MilestoneTracker, GrowthChart, etc. here.</p>
    </div>
  );
};

export default TrackersHub;
