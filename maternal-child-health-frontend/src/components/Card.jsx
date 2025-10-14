import React from 'react';


const Card = ({ title, children, buttonText, buttonStyle, onButtonClick }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">
        {children}
      </div>
      {buttonText && (
        <button className={`button ${buttonStyle}`} onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;
