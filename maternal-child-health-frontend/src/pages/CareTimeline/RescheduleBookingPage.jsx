import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Adjust path if needed

const RescheduleBookingPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [rescheduleReason, setRescheduleReason] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/api/bookings/${bookingId}`);
                setBooking(res.data);
                setNewDate(res.data.preferredDate);
                setNewTime(res.data.preferredTime);
            } catch (error) {
                console.error("Failed to fetch booking:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.patch(`/api/bookings/${bookingId}`, {
                preferredDate: newDate,
                preferredTime: newTime,
                rescheduleReason: rescheduleReason,
            });

            alert("Appointment rescheduled successfully.");
            navigate("/calendar");
        } catch (error) {
            console.error("Rescheduling failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-center py-5">Loading booking...</p>;
    if (!booking) return <p className="text-center py-5">Booking not found.</p>;

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">Reschedule Appointment</h2>
            <div className="card mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-body">
                    <p>
                        <strong>Name:</strong> {booking.fullName}
                    </p>
                    <p>
                        <strong>Current Date:</strong> {booking.preferredDate}
                    </p>
                    <p>
                        <strong>Current Time:</strong> {booking.preferredTime}
                    </p>
                    <p>
                        <strong>Location:</strong> {booking.location}
                    </p>
                    <p>
                        <strong>Reason:</strong> {booking.reason}
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">New Date</label>
                            <input
                                type="date"
                                className="form-control"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">New Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Reason for Rescheduling
                            </label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={rescheduleReason}
                                onChange={(e) =>
                                    setRescheduleReason(e.target.value)
                                }
                                placeholder="Explain why you need to reschedule"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Rescheduling..."
                                : "Confirm Reschedule"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RescheduleBookingPage;
