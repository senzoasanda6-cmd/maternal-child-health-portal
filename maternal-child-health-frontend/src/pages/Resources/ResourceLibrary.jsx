import React, { useState } from "react";
import Layout from "../../layouts/Layout";
import ResourceSearch from "../../components/ResourceSearch";
import { Link } from "react-router-dom";

const allResources = [
  {
    title: "Nutrition During Pregnancy",
    category: "Pregnancy",
    link: "/resources/nutrition",
    icon: "bi-book",
    color: "primary",
  },
  {
    title: "Postnatal Care Checklist",
    category: "Postnatal",
    link: "/resources/postnatal-checklist",
    icon: "bi-file-earmark-pdf",
    color: "success",
  },
  {
    title: "Breastfeeding Tips",
    category: "Nutrition",
    link: "/resources/breastfeeding-video",
    icon: "bi-play-circle",
    color: "warning",
  },
];

const ResourceLibrary = () => {
  const [filteredResources, setFilteredResources] = useState(allResources);

  return (
    <Layout>
      <div className="container py-5">
        <h2>Resource Library</h2>
        <p>Explore educational materials by topic or category.</p>

        <ResourceSearch resources={allResources} onFilter={setFilteredResources} />

        <div className="row">
          {filteredResources.map((resource, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className={`card border-${resource.color} h-100 shadow-sm`}>
                <div className="card-body text-center">
                  <i className={`bi ${resource.icon} fs-1 text-${resource.color}`}></i>
                  <h5 className="mt-3">{resource.title}</h5>
                  <p className="text-muted">{resource.category}</p>
                  <Link to={resource.link} className={`btn btn-outline-${resource.color} btn-sm`}>
                    View Resource
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ResourceLibrary;
