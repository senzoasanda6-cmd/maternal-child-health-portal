import React from 'react';
import { Link } from 'react-router-dom';

const LabourDelivery = () => {
    return (
        <div className="container my-4">
            <h1 className="text-custom-color-primary">Labour & Delivery</h1>
            <p className="lead">
                Support and clinical care during labour and delivery to ensure
                safe childbirth. This page contains information about signs of
                labour, what to expect at the facility, pain management
                options, and post-delivery care for mother and baby.
            </p>

            <section className="card mt-3">
                <h3>When to go to the facility</h3>
                <ul>
                    <li>Regular strong contractions (e.g. every 5 minutes for 1 hour)</li>
                    <li>Water breaking (any rupture of membranes)</li>
                    <li>Bleeding heavier than spotting</li>
                    <li>Reduced fetal movements in late pregnancy</li>
                </ul>

                <h3 className="mt-3">At the facility</h3>
                <p>
                    Skilled birth attendants will monitor you and the baby,
                    provide supportive care and intervene if complications
                    arise. Facilities may offer different levels of pain
                    relief and monitoring depending on level of care.
                </p>

                <div className="mt-3 d-flex gap-2">
                    <Link to="/mch-services/labour-delivery/appointment" className="button button-primary">
                        Book an appointment
                    </Link>
                    <Link to="/resources/emergency" className="button button-outline">
                        Emergency resources
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LabourDelivery;
