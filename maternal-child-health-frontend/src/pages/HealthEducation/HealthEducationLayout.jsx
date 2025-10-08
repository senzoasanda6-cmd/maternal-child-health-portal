import React from 'react';

const HealthEducationLayout = ({
  title,
  intro,
  sections,
  image,
  followUp,
  cta,
}) => {
  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">{title}</h1>
      {intro && <p className="lead text-center mb-5">{intro}</p>}

      {sections?.map((section, index) => (
        <div className="row mb-5" key={index}>
          <div className="col-md-6">
            <h3>{section.heading}</h3>
            <ul className="list-group">
              {section.items.map((item, i) => (
                <li className="list-group-item" key={i}>{item}</li>
              ))}
            </ul>
          </div>
          {section.image && (
            <div className="col-md-6">
              <img
                src={section.image}
                alt={section.heading}
                className="img-fluid rounded"
              />
            </div>
          )}
        </div>
      ))}

      {image && (
        <div className="text-center mb-4">
          <img src={image} alt="Topic Visual" className="img-fluid rounded" />
        </div>
      )}

      {followUp && (
        <div className="text-center">
          <h3>{followUp.heading}</h3>
          <p>{followUp.description}</p>
          {cta && (
            <a href={cta.link} className="btn btn-primary">
              {cta.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthEducationLayout;
