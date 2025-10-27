import React from 'react';
import { Link } from 'react-router-dom';

const Immunisations = () => {
    return (
        <div className="container my-4">
            <h1 className="text-custom-color-primary">Immunisations</h1>
            <p className="lead">
                Keep your child protected with recommended vaccinations and
                immunisation schedules. Below is an overview of routine
                childhood immunisations and when they are usually given.
            </p>

            <section className="card mt-3">
                <h3>Routine schedule (example)</h3>
                <ul>
                    <li>At birth: BCG, oral polio (where used)</li>
                    <li>6 weeks: DPT/Pentavalent, oral polio, Rotavirus</li>
                    <li>10 weeks: DPT/Pentavalent, oral polio</li>
                    <li>14 weeks: DPT/Pentavalent, oral polio, PCV</li>
                    <li>9 months: Measles</li>
                </ul>

                <h3 className="mt-3">Why immunisations matter</h3>
                <p>
                    Vaccines protect children and their communities from
                    serious and sometimes fatal diseases. Following the
                    recommended schedule ensures timely protection.
                </p>

                <div className="mt-3 d-flex gap-2">
                    <Link to="/mch-services/immunisations/appointment" className="button button-primary">
                        Book an appointment
                    </Link>
                    <Link to="/resources/nutrition" className="button button-outline">
                        Nutrition resources
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Immunisations;
