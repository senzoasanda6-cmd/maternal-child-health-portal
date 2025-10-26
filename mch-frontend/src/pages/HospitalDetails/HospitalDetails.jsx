import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HospitalDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hospital = state?.hospital;

    if (!hospital) {
        return (
            <div className="container my-5">
                <h2>Hospital details not available</h2>
                <p>
                    No hospital data was provided. Please navigate from the
                    landing page or select a hospital card to view details.
                </p>
                <button className="button button-secondary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-5 mb-4">
                    <img
                        src={`${process.env.PUBLIC_URL}${hospital.imageUrl}`}
                        alt={hospital.title}
                        className="img-fluid rounded-4 shadow"
                        style={{ objectFit: 'cover', width: '100%', height: '300px' }}
                        onError={(e) => (e.target.src = '/fallback.jpg')}
                    />
                </div>
                <div className="col-md">
                    <h2>{hospital.title}</h2>
                    <p>{hospital.summary}</p>

                    {hospital.top3services && (
                        <>
                            <h5>Top Services</h5>
                            <ul>
                                {hospital.top3services.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {hospital.fblink && (
                        <p>
                            <a href={hospital.fblink} target="_blank" rel="noreferrer">
                                Visit hospital page
                            </a>
                        </p>
                    )}

                    <div className="mt-3">
                        <button className="button button-secondary me-2" onClick={() => navigate(-1)}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetails;
