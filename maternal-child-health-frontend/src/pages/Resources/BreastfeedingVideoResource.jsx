import React from "react";
import Layout from "../../layouts/Layout";

const BreastfeedingVideoResource = () => {
  return (
    <Layout>
      <div className="container py-5">
        <h2>Breastfeeding Tips</h2>
        <p className="text-muted">Category: Nutrition</p>

        <p>
          Breastfeeding provides essential nutrients and bonding for newborns. This video offers practical tips for positioning, latching, and maintaining milk supply.
        </p>

        <div className="ratio ratio-16x9 mb-4">
          <iframe
            src="/breastfeeding-tips.mp4"
            title="Breastfeeding Tips"
            allowFullScreen
          ></iframe>
        </div>

        <p>
          For more guidance, explore our{" "}
          <a href="/resources/nutrition">Nutrition During Pregnancy</a> article.
        </p>
      </div>
    </Layout>
  );
};

export default BreastfeedingVideoResource;
