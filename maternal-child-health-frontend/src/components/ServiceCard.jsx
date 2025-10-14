import React from 'react';

const ServiceCard = ({ imageUrl, title, description }) => {
    return (
        <div className="card service-card rounded-4 shadow">
            <img
                src={`${process.env.PUBLIC_URL}${imageUrl}`}
                alt={title}
                className="w-100 mb-3"
                style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                }}
                onError={(e) =>
                    (e.target.src = "/fallback.jpg")
                }
            />
            <h3>{title}</h3>
            <p className='mb-3'>{description}</p>
        </div>
    );
};

export default ServiceCard;
