import React from "react";
import { useTranslation } from "react-i18next";

const HealthEducationLayout = ({
    title,
    intro,
    sections,
    image,
    followUp,
    cta,
    videos,
}) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="container py-4">
            <div className="text-end mb-3">
                <select
                    className="form-select w-auto d-inline-block"
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                    <option value="en">English</option>
                    <option value="zu">Zulu</option>
                    <option value="xh">Xhosa</option>
                </select>
            </div>

            <h1 className="mb-4 text-center">{t(title)}</h1>
            {intro && <p className="lead text-center mb-5">{t(intro)}</p>}

            {sections?.map((section, index) => (
                <div
                    className="accordion mb-5"
                    id={`accordion-${index}`}
                    key={index}
                >
                    <div className="accordion-item">
                        <h2
                            className="accordion-header"
                            id={`heading-${index}`}
                        >
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="true"
                                aria-controls={`collapse-${index}`}
                            >
                                {t(section.heading)}
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse show"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent={`#accordion-${index}`}
                        >
                            <div className="accordion-body">
                                <ul className="list-group">
                                    {section.items.map((item, i) => (
                                        <li className="list-group-item" key={i}>
                                            {t(item)}
                                        </li>
                                    ))}
                                </ul>
                                {section.image && (
                                    <img
                                        src={section.image}
                                        alt={t(section.heading)}
                                        className="img-fluid rounded mt-3"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {image && (
                <div className="text-center mb-4">
                    <img
                        src={image}
                        alt="Topic Visual"
                        className="img-fluid rounded"
                    />
                </div>
            )}

            {videos && (
                <div className="mt-5">
                    <h3>{t("Helpful Videos")}</h3>
                    <div className="row">
                        {videos.map((video, i) => (
                            <div className="col-md-6 mb-4" key={i}>
                                <div className="ratio ratio-16x9">
                                    <iframe
                                        src={video.url}
                                        title={t(video.title)}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <p className="mt-2">{t(video.title)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {followUp && (
                <div className="text-center mt-5">
                    <h3>{t(followUp.heading)}</h3>
                    <p>{t(followUp.description)}</p>
                    {cta && (
                        <a href={cta.link} className="btn btn-primary">
                            {t(cta.label)}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

export default HealthEducationLayout;
