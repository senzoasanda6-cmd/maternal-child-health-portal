import React from "react";

const TrimesterSection = ({ id, label, active, sections }) => {
  return (
    <div
      className={`tab-pane fade ${active ? "show active" : ""}`}
      id={id}
      role="tabpanel"
      aria-labelledby={`${id}-tab`}
    >
      <div className="accordion" id={`${id}Accordion`}>
        {sections.map((section, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`${id}Heading${index}`}>
              <button
                className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${id}Collapse${index}`}
                aria-expanded={index === 0}
                aria-controls={`${id}Collapse${index}`}
              >
                <i className={`bi ${section.icon} me-2`}></i>
                {section.title}
              </button>
            </h2>
            <div
              id={`${id}Collapse${index}`}
              className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
              aria-labelledby={`${id}Heading${index}`}
              data-bs-parent={`#${id}Accordion`}
            >
              <div className="accordion-body">{section.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrimesterSection;
