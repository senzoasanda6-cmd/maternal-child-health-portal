import React from "react";
import { useTranslation } from "react-i18next";
import TrimesterSection from "./TrimesterSection";
import LanguageSwitcher from "./LanguageSwitcher";
import "bootstrap-icons/font/bootstrap-icons.css";

const PregnancyStages = () => {
    const { t } = useTranslation();

    const trimesterData = [
        {
            id: "first",
            label: t("firstTrimester"),
            icon: "bi-calendar-heart",
            sections: [
                {
                    title: t("commonSymptoms"),
                    icon: "bi-emoji-smile",
                    content: t("symptomsContent"),
                },
                {
                    title: t("nutritionTips"),
                    icon: "bi-nutrition",
                    content: t("nutritionContent"),
                },
                {
                    title: t("emotionalWellness"),
                    icon: "bi-heart-pulse",
                    content: t("wellnessContent"),
                },
            ],
        },
        {
            id: "second",
            label: t("secondTrimester"),
            icon: "bi-body-text",
            sections: [
                {
                    title: t("physicalChanges"),
                    icon: "bi-body-text",
                    content: t("physicalContent"),
                },
                {
                    title: t("exerciseTips"),
                    icon: "bi-bicycle",
                    content: t("exerciseContent"),
                },
                {
                    title: t("medicalCheckups"),
                    icon: "bi-clipboard2-pulse",
                    content: t("checkupContent"),
                },
            ],
        },
        {
            id: "third",
            label: t("thirdTrimester"),
            icon: "bi-hospital",
            sections: [
                {
                    title: t("preparingForBirth"),
                    icon: "bi-hospital",
                    content: t("birthPrepContent"),
                },
                {
                    title: t("emotionalPreparation"),
                    icon: "bi-journal-medical",
                    content: t("emotionalPrepContent"),
                },
                {
                    title: t("finalMedicalPrep"),
                    icon: "bi-prescription2",
                    content: t("finalPrepContent"),
                },
            ],
        },
    ];

    return (
        <div className="container py-4">
            <LanguageSwitcher />
            <h1 className="mb-4 text-center">{t("pregnancyStages")}</h1>

            <ul className="nav nav-tabs" id="trimesterTabs" role="tablist">
                {trimesterData.map((trimester, index) => (
                    <li
                        className="nav-item"
                        role="presentation"
                        key={trimester.id}
                    >
                        <button
                            className={`nav-link ${
                                index === 0 ? "active" : ""
                            }`}
                            id={`${trimester.id}-tab`}
                            data-bs-toggle="tab"
                            data-bs-target={`#${trimester.id}`}
                            type="button"
                            role="tab"
                            aria-controls={trimester.id}
                            aria-selected={index === 0}
                        >
                            <i className={`bi ${trimester.icon} me-2`}></i>
                            {trimester.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tab-content mt-3" id="trimesterTabsContent">
                {trimesterData.map((trimester, index) => (
                    <TrimesterSection
                        key={trimester.id}
                        id={trimester.id}
                        label={trimester.label}
                        active={index === 0}
                        sections={trimester.sections}
                    />
                ))}
            </div>
        </div>
    );
};

export default PregnancyStages;
