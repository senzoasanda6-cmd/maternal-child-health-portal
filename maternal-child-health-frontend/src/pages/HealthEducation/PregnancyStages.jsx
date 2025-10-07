import React from "react";

const PregnancyStages = () => {
    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Pregnancy Stages</h1>

            <div className="row mb-4">
                <div classname="col-md-4">
                    <section>
                        <h2>First Trimester</h2>
                        <p>Symptoms, nutrition, and early scans.</p>
                    </section>
                </div>
            </div>

            <div classname="col-md-4">
                <section>
                    <h2>Second Trimester</h2>
                    <p>Development milestones, tests, and physical changes.</p>
                </section>
            </div>

            <div className="col-md-4">
                <section>
                    <h2>Third Trimester</h2>
                    <p>
                        Preparing for birth, signs of labor, and hospital
                        checklist.
                    </p>
                </section>
            </div>
        </div>

        //{/* <div className="text-center"> */}//
        //{/* <img src="https://via.placeholder.com/800x300" alt="Pregnancy stages" className="img-fluidncyStages; */}
    );
};

export default PregnancyStages;
