import React from "react";

const PostnatalChecklistResource = () => {
    return (
        <>
            <div className="container py-5">
                <h2>Postnatal Care Checklist</h2>
                <p className="text-muted">Category: Postnatal</p>

                <p>
                    This checklist helps mothers and caregivers stay on top of
                    essential postnatal care tasks. It includes medical
                    follow-ups, emotional wellness, and newborn milestones.
                </p>

                <h5 className="mt-4">📝 Checklist Items</h5>
                <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item">
                        ✔️ Schedule postpartum checkup (6 weeks after delivery)
                    </li>
                    <li className="list-group-item">
                        ✔️ Monitor healing of stitches or surgical site
                    </li>
                    <li className="list-group-item">
                        ✔️ Track baby's feeding and sleeping patterns
                    </li>
                    <li className="list-group-item">
                        ✔️ Watch for signs of postpartum depression
                    </li>
                    <li className="list-group-item">
                        ✔️ Ensure newborn vaccinations are scheduled
                    </li>
                    <li className="list-group-item">
                        ✔️ Practice safe sleep habits for baby
                    </li>
                    <li className="list-group-item">
                        ✔️ Maintain hydration and balanced nutrition
                    </li>
                </ul>

                <p>
                    You can download a printable version of this checklist or
                    explore related resources like{" "}
                    <a href="/resources/nutrition">
                        Nutrition During Pregnancy
                    </a>{" "}
                    and{" "}
                    <a href="/resources/breastfeeding-video">
                        Breastfeeding Tips
                    </a>
                    .
                </p>

                <div className="mt-4">
                    <a
                        href="/downloads/postnatal-checklist.pdf"
                        className="btn btn-outline-primary"
                    >
                        Download PDF
                    </a>
                </div>
            </div>
        </>
    );
};

export default PostnatalChecklistResource;
