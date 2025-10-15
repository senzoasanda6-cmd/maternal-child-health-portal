import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// import AppLoading from "../components/spinners/AppPageLoading";
// import AppLoadError from "../components/spinners/AppLoadError";

const PostnatalBookingPage = () => {
    const { t } = useTranslation();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: send data to backend or appointment system
        setSubmitted(true);
    };

    return (
        <div className="container p-5">
            <h1 className="mb-4 text-center">{t("bookPostnatalVisit")}</h1>
            <p className="text-center mb-4">{t("postnatalBookingIntro")}</p>

            {!submitted ? (
                <form
                    onSubmit={handleSubmit}
                    className="mx-auto"
                    style={{ maxWidth: "600px" }}
                >
                    <div className="mb-3">
                        <label className="form-label">{t("fullName")}</label>
                        <input type="text" className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            {t("preferredDate")}
                        </label>
                        <input type="date" className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            {t("preferredTime")}
                        </label>
                        <input type="time" className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">{t("location")}</label>
                        <select className="form-select" required>
                            <option value="">{t("selectLocation")}</option>
                            <option value="clinicA">{t("clinicA")}</option>
                            <option value="clinicB">{t("clinicB")}</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            {t("reasonForVisit")}
                        </label>
                        <textarea className="form-control" rows="3" required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        {t("submitBooking")}
                    </button>
                </form>
            ) : (
                <div className="alert alert-success text-center">
                    {t("bookingConfirmation")}
                </div>
            )}
        </div>
    );
};

export default PostnatalBookingPage;
