import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ imageUrl, title, description, navigateTo }) => {
    return (
        <div className="card service-card rounded-4 shadow d-flex flex-column justify-content-between p-3 h-100">
            <div>
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
            </div>
            {navigateTo && (
                <div className="d-flex gap-2 mt-2 justify-content-center">
                    <Link to={navigateTo} className="button button-primary">
                        Explore
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ServiceCard;
