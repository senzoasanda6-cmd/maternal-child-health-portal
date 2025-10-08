import React from "react";
import Layout from "../../layouts/Layout";

const NutritionResource = () => {
  return (
    <Layout>
      <div className="container py-5">
        <h2>Nutrition During Pregnancy</h2>
        <p className="text-muted">Category: Pregnancy</p>

        <p>
          Proper nutrition during pregnancy is essential for both mother and baby. This guide covers recommended foods, supplements, hydration tips, and common dietary concerns.
        </p>

        <ul>
          <li>Include iron-rich foods like spinach, lentils, and lean meats</li>
          <li>Take prenatal vitamins with folic acid</li>
          <li>Stay hydrated with water and avoid sugary drinks</li>
          <li>Limit caffeine and avoid alcohol</li>
        </ul>

        <p>
          For a printable checklist, visit our{" "}
          <a href="/resources/postnatal-checklist">Postnatal Care Guide</a>.
        </p>
      </div>
    </Layout>
  );
};

export default NutritionResource;
