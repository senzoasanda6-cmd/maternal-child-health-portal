import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import SimplePieChart from "../../components/charts/SimplePieChart";

const HospitalDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const hospital = state?.hospital;

    const isList = Array.isArray(hospital);

    // If we were passed an array of hospitals, compute a simple service distribution
    let serviceDistribution = [];
    if (isList) {
        const counts = {};
        hospital.forEach((h) => {
            (h.top3services || []).forEach((s) => {
                counts[s] = (counts[s] || 0) + 1;
            });
        });
        serviceDistribution = Object.keys(counts).map((k) => ({
            label: k,
            value: counts[k],
        }));
    }

    if (!hospital) {
        return (
            <div className="container my-5">
                <h2>Hospital details not available</h2>
                <p>
                    No hospital data was provided. Please navigate from the
                    landing page or select a hospital card to view details.
                </p>
                <button
                    className="button button-secondary"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (isList) {
        return (
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h2 className="text-custom-color-primary">
                            Gauteng MCHS Provider Hospitals
                        </h2>
                        <p className="mb-4">
                            Browse hospitals and their top services. Click a hospital to
                            view full details.
                        </p>
                    </div>

                    <div>
                        {/* Link back to the landing page and anchor to the services section */}
                        <Link to={'/#locServices'} className="button button-secondary">
                            Back to services
                        </Link>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="row g-3">
                            {hospital.map((h, i) => (
                                <div className="col-md-6" key={i}>
                                    <div className="card h-100 p-2 d-flex flex-column justify-content-between">
                                        <div>
                                            <img
                                                src={`${process.env.PUBLIC_URL}${h.imageUrl}`}
                                                alt={h.title}
                                                className="img-fluid rounded-3 mb-2"
                                                style={{
                                                    height: 140,
                                                    objectFit: "cover",
                                                    width: "100%",
                                                }}
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/fallback.jpg")
                                                }
                                            />
                                            <h6 className="mb-1">{h.title}</h6>
                                            <p className="text-muted small mb-2">
                                                {h.summary}
                                            </p>
                                            {h.top3services && (
                                                <p className="small mb-2">
                                                    <strong>Top:</strong>{" "}
                                                    {h.top3services.join(", ")}
                                                </p>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2 justify-content-between">
                                            <Link
                                                to="/hospital-details"
                                                state={{ hospital: h }}
                                                className="button button-primary"
                                            >
                                                View details
                                            </Link>
                                            {h.fblink && (
                                                <a
                                                    href={h.fblink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="button button-outline"
                                                >
                                                    <span
                                                        className="facebook-icon"
                                                        aria-hidden="true"
                                                    >
                                                        <FaFacebookF />
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-4 mb-3">
                        <div className="card p-3 h-100">
                            <h6>Service distribution (top services)</h6>
                            <div style={{ height: 220 }}>
                                <SimplePieChart
                                    data={serviceDistribution}
                                    height={200}
                                />
                            </div>
                            <small className="text-muted">
                                Aggregated from listed hospitals
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // single hospital view
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-5 mb-4">
                    <img
                        src={`${process.env.PUBLIC_URL}${hospital.imageUrl}`}
                        alt={hospital.title}
                        className="img-fluid rounded-4 shadow"
                        style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "300px",
                        }}
                        onError={(e) => (e.target.src = "/fallback.jpg")}
                    />
                </div>
                <div className="col-md">
                    <h2 className="text-custom-color-primary">
                        {hospital.title}
                    </h2>
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
                            <a
                                href={hospital.fblink}
                                target="_blank"
                                rel="noreferrer"
                                className="d-inline-flex align-items-center gap-2"
                                aria-label={`Visit ${hospital.title} Facebook page`}
                            >
                                <span
                                    className="facebook-icon"
                                    aria-hidden="true"
                                >
                                    <FaFacebookF />
                                </span>
                                <span>Visit Facebook page</span>
                            </a>
                        </p>
                    )}

                    <div className="mt-3">
                        <div className="d-flex gap-2">
                            <button
                                className="button button-secondary"
                                onClick={() => navigate('/#locServices')}
                            >
                                Back to services
                            </button>

                            <button
                                className="button button-outline"
                                onClick={() => navigate(-1)}
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalDetails;
