import React from 'react';
import EmotionExplorer from '../../components/EmotionExplorer.jsx';

function EmotionalWellness() {
    return (
        <div className="container mt-5" style={{
            background: "linear-gradient(135deg, #FFCCBC 0%, #FFEBEE 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
            <h2 className="fw-bold text-center" style={{ fontFamily: "Comic Neue, cursive", color: "#BF360C" }}>Emotional Wellness😊😔</h2>
            <h4 className="text-center mt-5 mb-3" style={{ fontFamily: "Comic Neue, cursive", color: "#D84315" }}>
                Explore Emotions
            </h4>
            <EmotionExplorer />
        </div>
    );
}

export default EmotionalWellness;
