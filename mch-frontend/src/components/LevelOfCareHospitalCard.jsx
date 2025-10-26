import React from 'react';
import { Link } from 'react-router-dom';

const LevelOfCareHospitalCard = ({ imageUrl, title, description, hospitals }) => {
    return (
        <div className="card service-card rounded-4 shadow card-institutions">
            <img
                src={`${process.env.PUBLIC_URL}${imageUrl}`}
                alt={title}
                className="w-100 mb-3"
                style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                }}
                onError={(e) => (e.target.src = "/fallback.jpg")}
            />
            <h3>{title}</h3>
            <p className="mb-3">{description}</p>

            <div className="d-flex gap-2 mt-2 justify-content-center">
                {/* Pass the selected hospital details via location.state */}
                <Link
                    to="/hospital-details"
                    state={{ hospital: hospitals }}
                    className="button button-primary"
                >
                    View Details
                </Link>

                {hospitals?.fblink && (
                    <a
                        href={hospitals.fblink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-accent"
                    >
                        Visit Page
                    </a>
                )}
            </div>
        </div>
    );
};

export default LevelOfCareHospitalCard;
