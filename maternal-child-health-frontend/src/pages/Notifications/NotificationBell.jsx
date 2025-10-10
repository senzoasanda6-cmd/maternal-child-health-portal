import React from 'react';

const NotificationBell = ({ count, onClick }) => {
  const bellContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '28px',
    color: '#333',
    transition: 'transform 0.2s ease-in-out',
  };

  const badgeStyle = {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: '#ff3b3b',
    color: '#fff',
    borderRadius: '50%',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    animation: 'pulse 1.5s infinite',
  };

  const bellHoverStyle = {
    ...bellContainerStyle,
    transform: 'scale(1.1)',
    color: '#007bff',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={isHovered ? bellHoverStyle : bellContainerStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      🔔
      {count > 0 && <span style={badgeStyle}>{count}</span>}
    </div>
  );
};

export default NotificationBell;
