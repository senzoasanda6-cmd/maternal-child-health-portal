import React from "react";

const SafeMedicines = () => {
    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Safe Medicines</h1>

            <div className="row mb-5">
                <div className="col-md-6">
                    <section>
                        <h2>During Pregnancy</h2>
                        <ul className="list-group">
                            <li className="list-group-item">
                                Approved pain relievers
                            </li>
                            <li className="list-group-item">
                                Cold and flu remedies
                            </li>
                            <li className="list-group-item">
                                Supplements (e.g., folic acid)
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
            <div className="col-md-6">
                {/* <img src="https://via.placeholder.com/400x250" alt="Pregnancy medicine" className="img-fluid rounded      <div className="col-md-6"> */}
                {/* //   <img src="https://via.placeholder.com/400x250" alt="Breastfeeding medicine" className="img-fluid<h3>While Breastfeeding</h3> */}

                <section>
                    <h2>While Breastfeeding</h2>
                    <ul className="list-group">
                        <li className="list-group-item">
                            Antibiotics compatibility
                        </li>
                        <li className="list-group-item">Allergy medications</li>
                        <li className="list-group-item">Contraceptives</li>
                    </ul>
                </section>
            </div>

            <div className="alert alert-warning text-center">
                <strong>Reminder</strong> Always consult a healthcare provider
                before taking any medication.
                <section>
                    <h2>Consultation Reminder</h2>
                    <p>
                        Always consult a healthcare provider before taking any
                        medication.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default SafeMedicines;
