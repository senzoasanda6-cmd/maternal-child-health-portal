import React from "react";
import { useTranslation } from "react-i18next";

const ChildGrowthMilestones = () => {
    const { t } = useTranslation();

    const milestones = [
        {
            age: t("infant_age"),
            description: t("infant_milestones"),
            icon: "bi-baby",
            color: "primary",
        },
        {
            age: t("toddler_age"),
            description: t("toddler_milestones"),
            icon: "bi-person-walking",
            color: "success",
        },
        {
            age: t("preschool_age"),
            description: t("preschool_milestones"),
            icon: "bi-brush",
            color: "warning",
        },
        {
            age: t("school_age"),
            description: t("school_milestones"),
            icon: "bi-book",
            color: "info",
        },
        {
            age: t("adolescent_age"),
            description: t("adolescent_milestones"),
            icon: "bi-people",
            color: "danger",
        },
    ];

    return (
        <div className="container py-5">
            <h2 className="mb-4 text-center">{t("child_growth_milestones")}</h2>
            <p className="lead text-center mb-5">
                {t("child_growth_milestones_intro")}
            </p>

            <div className="row">
                {milestones.map((milestone, index) => (
                    <div className="col-md-6 mb-4" key={index}>
                        <div
                            className={`card border-${milestone.color} shadow-sm h-100`}
                        >
                            <div className="card-body">
                                <i
                                    className={`bi ${milestone.icon} fs-1 text-${milestone.color}`}
                                ></i>
                                <h5 className="mt-3">{milestone.age}</h5>
                                <p>{milestone.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className="mt-5">
                <h3>{t("tips_for_parents")}</h3>
                <ul>
                    <li>{t("tip_play")}</li>
                    <li>{t("tip_talk")}</li>
                    <li>{t("tip_nutrition")}</li>
                    <li>{t("tip_checkups")}</li>
                </ul>
            </section>
        </div>
    );
};

export default ChildGrowthMilestones;
