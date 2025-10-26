import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const SERVICES = [
    {
        slug: 'prenatal-care',
        title: 'Prenatal Care',
        imageUrl: '/sample_images/Picture1.jpg',
        description:
            'Comprehensive support throughout your pregnancy journey, from the first trimester to delivery.',
        content: `Prenatal care includes regular check-ups, screening tests, nutritional advice, and monitoring to ensure the best possible outcome for mother and baby.`,
    },
    {
        slug: 'child-wellness',
        title: 'Child Wellness',
        imageUrl: '/Child-Wellness.png',
        description:
            "Track your child's growth, vaccinations, and developmental milestones with our expert guidance.",
        content: `Child wellness services include growth monitoring, immunisation scheduling, milestone tracking and nutritional support to help children thrive.`,
    },
    {
        slug: 'postnatal-support',
        title: 'Postnatal Support',
        imageUrl: '/sample_images/Picture3.jpg',
        description:
            'Guidance and care for mothers and newborns in the critical weeks after birth.',
        content: `Postnatal support covers maternal recovery, breastfeeding support, newborn checks and emotional wellbeing services for the family.`,
    },
];

const MchServicePage = () => {
    const location = useLocation();
    const { slug } = useParams();

    const service = SERVICES.find((s) => s.slug === slug);

    if (!service) {
        return (
            <div className="container my-5">
                <h2>Service not found</h2>
                <p>The requested service could not be located: <strong>{slug}</strong></p>
                <Link to="/" className="button button-secondary">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img
                        src={`${process.env.PUBLIC_URL}${service.imageUrl}`}
                        alt={service.title}
                        className="img-fluid rounded-4 shadow"
                        style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                        onError={(e) => (e.target.src = '/fallback.jpg')}
                    />
                </div>
                <div className="col-md-6">
                    <h1>{service.title}</h1>
                    <p className="lead">{service.description}</p>
                    <p>{service.content}</p>

                    <h5>How to access this service</h5>
                    <p>
                        Visit your local clinic or hospital and ask for {service.title.toLowerCase()}. For urgent concerns, contact emergency services.
                    </p>

                    <div className="mt-3 d-flex gap-2">
                        <Link to="/" className="button button-secondary">Home</Link>
                        <Link
                            to={`/mch-services/${slug}/appointment`}
                            state={{ service, mother: location.state?.mother }}
                            className="button button-primary"
                        >
                            Book an appointment
                        </Link>
                        <Link
                            to="/resources/emergency"
                            className="button button-danger"
                            aria-label="Emergency resources"
                            title="Emergency resources"
                        >
                            Emergency
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MchServicePage;
