import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const HealthEducationHome = () => {
    const { t } = useTranslation();

    const resources = [
        {
            title: t("nutrition_during_pregnancy"),
            type: t("article"),
            icon: "bi-book",
            link: "/resources/nutrition",
            color: "primary",
        },
        {
            title: t("postnatal_care_checklist"),
            type: t("downloadable_guide"),
            icon: "bi-file-earmark-pdf",
            link: "/resources/postnatal-checklist",
            color: "success",
        },
        {
            title: t("breastfeeding_tips"),
            type: t("video"),
            icon: "bi-play-circle",
            link: "/resources/breastfeeding-video",
            color: "warning",
        },
    ];

    return (
        <div className="container-fluid">
            <LanguageSwitcher />
            <div className="row" >
                <aside className="col-md-3 bg-light border-end py-4" style={{backgroundColor: "Black", color:"#ccc"}}>
                    <nav className="nav flex-column px-3" style={{backgroundColor: "Black", color:"#ccc"}}>
                        <h5 className="mb-3">{t("health_education")}</h5>
                        <Link to="/PregnancyStages" className="nav-link">
                            {t("pregnancy_stages")}
                        </Link>
                        <Link to="/SafeMedicines" className="nav-link">
                            {t("safe_medicines")}
                        </Link>
                        <Link to="/postnatal-visits/1" className="nav-link">
                            {t("visit_history")}
                        </Link>
                        <Link to="/dashboard" className="nav-link">
                            {t("hospital_dashboard")}
                        </Link>
                    </nav>
                </aside>

                <main className="col-md-9 py-4">
                    <section className="mb-4">
                        <h2>{t("welcome_heading")}</h2>
                        <p>{t("welcome_paragraph")}</p>
                    </section>

                    <section className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <i className="bi bi-heart-pulse fs-1 text-primary"></i>
                                    <h5 className="mt-3">
                                        {t("pregnancy_stages")}
                                    </h5>
                                    <p>{t("pregnancy_stages_description")}</p>
                                    <Link
                                        to="/PregnancyStages"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        {t("explore")}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <i className="bi bi-capsule fs-1 text-success"></i>
                                    <h5 className="mt-3">
                                        {t("safe_medicines")}
                                    </h5>
                                    <p>{t("safe_medicines_description")}</p>
                                    <Link
                                        to="/SafeMedicines"
                                        className="btn btn-outline-success btn-sm"
                                    >
                                        {t("view_list")}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <i className="bi bi-clipboard-data fs-1 text-warning"></i>
                                    <h5 className="mt-3">
                                        {t("visit_history")}
                                    </h5>
                                    <p>{t("visit_history_description")}</p>
                                    <Link
                                        to="/postnatal-visits/1"
                                        className="btn btn-outline-warning btn-sm"
                                    >
                                        {t("view_visits")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-5">
                        <h3 className="mb-4">{t("resource_library")}</h3>
                        <p>{t("resource_intro")}</p>
                        <div className="row">
                            {resources.map((resource, index) => (
                                <div className="col-md-4 mb-4" key={index}>
                                    <div
                                        className={`card border-${resource.color} h-100 shadow-sm`}
                                    >
                                        <div className="card-body text-center">
                                            <i
                                                className={`bi ${resource.icon} fs-1 text-${resource.color}`}
                                            ></i>
                                            <h5 className="mt-3">
                                                {resource.title}
                                            </h5>
                                            <p className="text-muted">
                                                {resource.type}
                                            </p>
                                            <Link
                                                to={resource.link}
                                                className={`btn btn-outline-${resource.color} btn-sm`}
                                            >
                                                {t("view_resource")}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default HealthEducationHome;
