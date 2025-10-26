import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';

// Placeholder service list - user will populate from DB later
const AVAILABLE_SERVICES = [
    'Prenatal Care',
    'Labour & Delivery',
    'Postnatal Support',
    'Child Wellness',
    'Immunisations',
];

const AppointmentBooking = () => {
    const { slug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Attempt to prefill from incoming state (e.g., service or mother)
    const incomingService = location.state?.service;
    const incomingMother = location.state?.mother;

    const [form, setForm] = useState({
        motherName: '',
        motherPhone: '',
        service: incomingService?.title || '',
        preferredDate: '',
        notes: '',
    });

    useEffect(() => {
        // If incoming mother exists, populate fields
        if (incomingMother) {
            setForm((f) => ({
                ...f,
                motherName: incomingMother.name || incomingMother.fullName || f.motherName,
                motherPhone: incomingMother.phone || incomingMother.mobile || f.motherPhone,
            }));
        }
        // If route slug corresponds to a service slug, set a friendly label if not already set
        if (!form.service && slug) {
            // Map common slugs to titles (small helper)
            const label = slug.replace(/-/g, ' ');
            setForm((f) => ({ ...f, service: label }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [incomingMother, incomingService, slug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // For now just log; wiring to API will be added later
        console.log('Appointment requested', form, { slug });
        // Show a simple success state and optionally navigate back
        alert('Appointment requested. We will contact you with confirmation.');
        navigate('/');
    };

    return (
        <div className="container my-5">
            <h2>Book an appointment</h2>
            <p className="mb-4">Please complete the form below to request an appointment.</p>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-3">
                    <label className="form-label">Mother / Patient name</label>
                    <input
                        name="motherName"
                        className="form-control"
                        value={form.motherName}
                        onChange={handleChange}
                        placeholder="Full name"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        name="motherPhone"
                        className="form-control"
                        value={form.motherPhone}
                        onChange={handleChange}
                        placeholder="Mobile or contact number"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Service</label>
                    <select name="service" className="form-select" value={form.service} onChange={handleChange} required>
                        <option value="">Select service</option>
                        {AVAILABLE_SERVICES.map((s) => (
                            <option value={s} key={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Preferred date</label>
                    <input type="date" name="preferredDate" className="form-control" value={form.preferredDate} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea name="notes" className="form-control" value={form.notes} onChange={handleChange} rows={3} />
                </div>

                <div className="d-flex gap-2">
                    <button className="button button-primary" type="submit">Request appointment</button>
                    <Link to={`/mch-services/${slug}`} className="button button-secondary">Back</Link>
                </div>
            </form>

            <p className="text-muted">Note: This is a demo form. I will connect it to the database/service when available.</p>
        </div>
    );
};

export default AppointmentBooking;
