import React from 'react';

const emotions = [
    { emotion: "Happy", emoji: "😊", color: "#FFD166" }, // Sunshine yellow
    { emotion: "Sad", emoji: "😢", color: "#BBDEFB" },   // Baby blue
    { emotion: "Angry", emoji: "😡", color: "#FF6B6B" }, // Cherry red
    { emotion: "Excited", emoji: "🤩", color: "#06D6A0" }, // Mint green
    { emotion: "Scared", emoji: "😨", color: "#E1BEE7" }, // Lavender
    { emotion: "Sleepy", emoji: "😴", color: "#B2DFDB" }, // Light blue
];

const EmotionExplorer = () => {
    return (
        <div
            className="d-flex flex-wrap justify-content-center align-items-center p-4 rounded-circle shadow-lg mx-auto"
            style={{
                width: '300px',
                height: '300px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '4px solid #FFD166', // Sunshine yellow border
                position: 'relative',
                fontFamily: 'Baloo, sans-serif',
            }}
        >
            {emotions.map((emo, index) => {
                // Calculate position for circular layout
                const angle = (index / emotions.length) * 2 * Math.PI;
                const radius = 100; // Distance from center
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                    <div
                        key={emo.emotion}
                        className="d-flex flex-column align-items-center justify-content-center rounded-circle shadow-sm"
                        style={{
                            position: 'absolute',
                            left: `calc(50% + ${x}px - 30px)`, // Adjust for item size
                            top: `calc(50% + ${y}px - 30px)`,   // Adjust for item size
                            width: '60px',
                            height: '60px',
                            backgroundColor: emo.color,
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out',
                        }}
                    >
                        <span style={{ fontSize: '1.8rem' }}>{emo.emoji}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default EmotionExplorer;
