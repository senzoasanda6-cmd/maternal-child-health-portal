import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure this is installed

const PregnancyStages = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Pregnancy Stages</h1>

      <ul className="nav nav-tabs" id="trimesterTabs" role="tablist">
        {["First", "Second", "Third"].map((stage, index) => (
          <li className="nav-item" role="presentation" key={stage}>
            <button
              className={`nav-link ${index === 0 ? "active" : ""}`}
              id={`${stage.toLowerCase()}-tab`}
              data-bs-toggle="tab"
              data-bs-target={`#${stage.toLowerCase()}`}
              type="button"
              role="tab"
              aria-controls={stage.toLowerCase()}
              aria-selected={index === 0}
            >
              <i className="bi bi-calendar-heart me-2"></i>
              {stage} Trimester
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content mt-3" id="trimesterTabsContent">
        {/* First Trimester */}
        <div
          className="tab-pane fade show active"
          id="first"
          role="tabpanel"
          aria-labelledby="first-tab"
        >
          <div className="accordion" id="firstAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="firstHeadingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#firstCollapseOne"
                  aria-expanded="true"
                  aria-controls="firstCollapseOne"
                >
                  <i className="bi bi-emoji-smile me-2"></i>
                  Common Symptoms
                </button>
              </h2>
              <div
                id="firstCollapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="firstHeadingOne"
                data-bs-parent="#firstAccordion"
              >
                <div className="accordion-body">
                  Nausea, fatigue, and mood swings are common in early pregnancy.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="firstHeadingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#firstCollapseTwo"
                  aria-expanded="false"
                  aria-controls="firstCollapseTwo"
                >
                  <i className="bi bi-nutrition me-2"></i>
                  Nutrition Tips
                </button>
              </h2>
              <div
                id="firstCollapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="firstHeadingTwo"
                data-bs-parent="#firstAccordion"
              >
                <div className="accordion-body">
                  Focus on folic acid, iron-rich foods, and hydration.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Trimester */}
        <div
          className="tab-pane fade"
          id="second"
          role="tabpanel"
          aria-labelledby="second-tab"
        >
          <div className="accordion" id="secondAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="secondHeadingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#secondCollapseOne"
                  aria-expanded="true"
                  aria-controls="secondCollapseOne"
                >
                  <i className="bi bi-body-text me-2"></i>
                  Physical Changes
                </button>
              </h2>
              <div
                id="secondCollapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="secondHeadingOne"
                data-bs-parent="#secondAccordion"
              >
                <div className="accordion-body">
                  Baby bump grows, and energy levels improve.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Third Trimester */}
        <div
          className="tab-pane fade"
          id="third"
          role="tabpanel"
          aria-labelledby="third-tab"
        >
          <div className="accordion" id="thirdAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="thirdHeadingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#thirdCollapseOne"
                  aria-expanded="true"
                  aria-controls="thirdCollapseOne"
                >
                  <i className="bi bi-hospital me-2"></i>
                  Preparing for Birth
                </button>
              </h2>
              <div
                id="thirdCollapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="thirdHeadingOne"
                data-bs-parent="#thirdAccordion"
              >
                <div className="accordion-body">
                  Pack your hospital bag, review birth plans, and watch for labor signs.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PregnancyStages;
