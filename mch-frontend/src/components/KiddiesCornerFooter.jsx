import React from 'react';

const KiddiesCornerFooter = () => {
    return (
        <div
            className="d-flex flex-wrap justify-content-around align-items-center p-3 rounded-4 shadow-sm mt-4"
            style={{ backgroundColor: '#B3E5FC', fontFamily: 'Baloo, sans-serif' }} // Light blue pastel
        >
            {/* Parent Mode Toggle */}
            <div className="form-check form-switch d-flex align-items-center mb-2 mb-md-0">
                <input
                    className="form-check-input me-2"
                    type="checkbox"
                    role="switch"
                    id="parentModeSwitch"
                    style={{ transform: 'scale(1.2)' }}
                />
                <label className="form-check-label fw-bold" htmlFor="parentModeSwitch">
                    Parent Mode
                </label>
            </div>

            {/* Time Played Animation (simplified) */}
            <p className="mb-2 mb-md-0 fw-bold">
                <span role="img" aria-label="clock">⏰</span> 20 minutes played!
            </p>

            {/* Language Selector */}
            <div className="d-flex align-items-center">
                <label htmlFor="languageSelect" className="me-2 fw-bold">Language:</label>
                <select id="languageSelect" className="form-select form-select-sm" style={{ maxWidth: '120px' }}>
                    <option value="en">English</option>
                    <option value="zu">Zulu</option>
                    <option value="xh">Xhosa</option>
                    <option value="af">Afrikaans</option>
                </select>
            </div>
        </div>
    );
};

export default KiddiesCornerFooter;
