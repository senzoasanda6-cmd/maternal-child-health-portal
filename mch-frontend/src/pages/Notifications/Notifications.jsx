import React from 'react'
import Notification from './Notification';

function Notifications() {
    return (
        <div>
            <h2>Notifications</h2>
            <Notification message="You have a new message!" />
            <Notification message="Your profile was updated." />
        </div>
    );
}

export default Notifications