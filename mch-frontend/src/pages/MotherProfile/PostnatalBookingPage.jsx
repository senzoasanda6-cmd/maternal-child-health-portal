import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import "./PostnatalBookingPage.css"; // optional for styling

const PostnatalBookingPage = () => {
    const { t } = useTranslation();
    const [facilities, setFacilities] = useState([]);
    const [mother, setMother] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        location: "",
        reason: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [bookingMode, setBookingMode] = useState("request"); // 'direct' or 'request'

    useEffect(() => {
        fetchFacilities();
        fetchMotherProfile();
    }, []);

    useEffect(() => {
        if (formData.date && formData.location) {
            fetchAvailableTimes(formData.date, formData.location);
        }
    }, [formData.date, formData.location]);

    const fetchFacilities = async () => {
        try {
            const res = await api.get("/facilities");
            setFacilities(res.data);
        } catch (err) {
            console.error("Failed to fetch facilities:", err);
        }
    };

    const fetchMotherProfile = async () => {
        try {
            const res = await api.get("/mother/profile");
            setMother(res.data);
            setFormData((prev) => ({
                ...prev,
                fullName: res.data.name || "",
                email: res.data.email || "",
                phone: res.data.phone || "",
            }));
            setBookingMode(res.data.is_premium ? "direct" : "request");
        } catch (err) {
            console.error("Failed to fetch mother profile:", err);
        }
    };

    const fetchAvailableTimes = async (date, facilityId) => {
        try {
            // Simulated times, replace with backend API
            const allTimes = [
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
            ];

            const now = new Date();
            const selectedDate = new Date(date);
            let filteredTimes = allTimes;

            if (selectedDate.toDateString() === now.toDateString()) {
                const currentHour = now.getHours();
                filteredTimes = allTimes.filter(
                    (t) => parseInt(t.split(":")[0]) > currentHour
                );
            }

            // For demonstration, mark some slots as unavailable
            const unavailable = ["10:00", "14:00"];
            const timesWithStatus = filteredTimes.map((t) => ({
                time: t,
                available: !unavailable.includes(t),
            }));

            setAvailableTimes(timesWithStatus);
            setFormData((prev) => ({ ...prev, time: "" }));
        } catch (err) {
            console.error("Failed to fetch available times:", err);
            setAvailableTimes([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTimeSelect = (slot) => {
        if (slot.available) {
            setFormData((prev) => ({ ...prev, time: slot.time }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.date || !formData.time) {
            setError(
                t("selectDateTimeError") || "Please select date and time."
            );
            return;
        }

        const now = new Date();
        const selectedDate = new Date(`${formData.date}T${formData.time}`);
        if (selectedDate < now) {
            setError(t("bookingPastError") || "Cannot select past date/time.");
            return;
        }

        try {
            const payload = {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                preferred_date: formData.date,
                preferred_time: formData.time,
                location: formData.location,
                reason: formData.reason,
            };

            if (bookingMode === "direct") {
                await api.post("/postnatal-bookings", {
                    ...payload,
                    status: "confirmed",
                });
            } else {
                await api.post("/registration-request", {
                    type: "postnatal_booking",
                    payload,
                });
            }

            setSubmitted(true);
        } catch (err) {
            console.error("Booking failed:", err);
            setError(t("bookingError") || "Failed to submit booking.");
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="container p-5">
            <h1 className="mb-4 text-center">{t("bookPostnatalVisit")}</h1>
            <p className="text-center mb-4">
                {bookingMode === "direct"
                    ? t("premiumBookingNotice")
                    : t("normalBookingNotice")}
            </p>

            {error && (
                <div className="alert alert-danger text-center">{error}</div>
            )}

            {!submitted ? (
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto"
                    style={{ maxWidth: "600px" }}
                >
                    {/* Mother info */}
                    <div className="mb-3">
                        <label className="form-label">{t("fullName")}</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("email")}</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("phone")}</label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Booking date */}
                    <div className="mb-3">
                        <label className="form-label">
                            {t("preferredDate")}
                        </label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            min={today}
                            required
                        />
                    </div>

                    {/* Facility selection */}
                    <div className="mb-3">
                        <label className="form-label">{t("location")}</label>
                        <select
                            name="location"
                            className="form-select"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t("selectLocation")}</option>
                            {facilities.map((f) => (
                                <option key={f.id} value={f.id}>
                                    {f.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Time slots grid */}
                    {availableTimes.length > 0 && (
                        <div className="mb-3">
                            <label className="form-label">
                                {t("availableTimeSlots")}
                            </label>
                            <div className="time-slots-grid">
                                {availableTimes.map((slot) => (
                                    <button
                                        key={slot.time}
                                        type="button"
                                        className={`time-slot-btn ${
                                            slot.available
                                                ? "available"
                                                : "unavailable"
                                        } ${
                                            formData.time === slot.time
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => handleTimeSelect(slot)}
                                        disabled={!slot.available}
                                    >
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">
                            {t("reasonForVisit")}
                        </label>
                        <textarea
                            name="reason"
                            className="form-control"
                            rows="3"
                            value={formData.reason}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        {bookingMode === "direct"
                            ? t("confirmBooking")
                            : t("submitBookingRequest")}
                    </button>
                </form>
            ) : (
                <div className="alert alert-success text-center">
                    {bookingMode === "direct"
                        ? t("bookingConfirmedMessage")
                        : t("bookingRequestSubmittedMessage")}
                </div>
            )}
        </div>
    );
};

export default PostnatalBookingPage;
