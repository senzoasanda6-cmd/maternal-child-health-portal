import React from 'react';

const PostNatalCare = () => {
    return (
        <div className="container py-4">
            <h1 className="mb-4 text-center">Postnatal Care</h1>

            <div className="row mb-5">
                <div className="col-md-6">
                    <h3>Mother's Health</h3>
                    <ul className="list-group">
                        <li className="list-group-item">Physical recovery tips</li>
                        <li className="list-group-item">Mental health support</li>
                        <li className="list-group-item">Nutrition and rest</li>
                    </ul>
                </div>
                <div className="col-md-6">
                    https://via.placeholder.com/400x250
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-md-6">
                    <img
                        src="maternal-child-health-frontend\public\dizziness-during-pregnancy-hero-shutterstock_2273460889 (1).png"
                        alt=""
                        className="img-fluid"
                    />
                    <h3>Baby's Health</h3>
                    <ul className="list-group">
                        <li className="list-group-item">Vaccination schedule</li>
                        <li className="list-group-item">Feeding guidelines</li>
                        <li className="list-group-item">Growth monitoring</li>
                    </ul>
                </div>
            </div>

            <div className="text-center">
                <h3>Follow-up Visits</h3>
                <p>Schedule and importance of postnatal checkups.</p>
            </div>
        </div>
    );
};

export default PostNatalCare;