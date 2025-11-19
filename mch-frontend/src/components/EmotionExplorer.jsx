import React, { useState } from 'react';

const emotions = [
    { emotion: "Happy", emoji: "😊", color: "#FFD166", description: "Feeling joyful and full of smiles! Happiness is when everything feels bright and fun." },
    { emotion: "Sad", emoji: "😢", color: "#BBDEFB", description: "Feeling down or blue. It's okay to feel sad sometimes, and talking about it can help." },
    { emotion: "Angry", emoji: "😡", color: "#FF6B6B", description: "Feeling mad or frustrated. Anger can be strong, but we can learn to calm down." },
    { emotion: "Excited", emoji: "🤩", color: "#06D6A0", description: "Feeling thrilled and energetic! Excitement makes you want to jump and shout." },
    { emotion: "Scared", emoji: "😨", color: "#E1BEE7", description: "Feeling afraid or nervous. Fear is normal, and brave people face their fears." },
    { emotion: "Sleepy", emoji: "😴", color: "#B2DFDB", description: "Feeling tired and ready for rest. Sleep helps us feel better and dream." },
];

const EmotionExplorer = () => {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [hoveredEmotion, setHoveredEmotion] = useState(null);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        const randomIndex = Math.floor(Math.random() * emotions.length);
        const spins = 5; // Number of full spins
        const targetRotation = rotation + spins * 360 + randomIndex * 60;
        setRotation(targetRotation);
    };

    const handleTransitionEnd = () => {
        setSpinning(false);
        const normalizedRotation = rotation % 360;
        const index = Math.round(normalizedRotation / 60) % emotions.length;
        setSelectedEmotion(emotions[index]);
        setShowPopup(true);
    };

    const handleChat = () => {
        alert(`Starting chat about ${selectedEmotion.emotion}! (Chatbot integration coming soon)`);
        // Here you would integrate with the chatbot
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedEmotion(null);
    };

    return (
        <div style={{ position: 'relative', textAlign: 'center' }}>
            {/* Stationary Pointer */}
            <div style={{
                position: 'absolute',
                top: '140px', // Position above the wheel center
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '15px solid transparent',
                borderRight: '15px solid transparent',
                borderBottom: '30px solid #FFD166',
                zIndex: 10,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}></div>

            <div
                className="d-flex flex-wrap justify-content-center align-items-center p-4 rounded-circle shadow-lg mx-auto"
                style={{
                    width: '300px',
                    height: '300px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '4px solid #FFD166',
                    position: 'relative',
                    fontFamily: 'Baloo, sans-serif',
                    cursor: 'default',
                    transform: `rotate(${rotation}deg)`,
                    transition: spinning ? 'transform 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >

                {emotions.map((emo, index) => {
                    const angle = (index / emotions.length) * 2 * Math.PI - Math.PI / 2; // Start from top
                    const radius = 100;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);

                    return (
                        <div
                            key={emo.emotion}
                            className="d-flex flex-column align-items-center justify-content-center rounded-circle shadow-sm"
                            style={{
                                position: 'absolute',
                                left: `calc(50% + ${x}px - 30px)`,
                                top: `calc(50% + ${y}px - 30px)`,
                                width: '60px',
                                height: '60px',
                                backgroundColor: emo.color,
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                transform: `rotate(${-rotation}deg) ${spinning ? 'scale(0.9)' : 'scale(1)'}`,
                            }}
                            onMouseEnter={(e) => {
                                setHoveredEmotion(emo);
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
                                e.currentTarget.style.transform = `rotate(${-rotation}deg) scale(1.1)`;
                            }}
                            onMouseLeave={(e) => {
                                setHoveredEmotion(null);
                                e.currentTarget.style.boxShadow = '';
                                e.currentTarget.style.transform = `rotate(${-rotation}deg) ${spinning ? 'scale(0.9)' : 'scale(1)'}`;
                            }}
                        >
                            <span style={{ fontSize: '1.8rem' }}>{emo.emoji}</span>
                        </div>
                    );
                })}
            </div>

            {/* Hover Tooltip */}
            {hoveredEmotion && (
                <div style={{
                    position: 'absolute',
                    top: '320px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    maxWidth: '200px',
                    textAlign: 'center',
                    zIndex: 20,
                }}>
                    <strong>{hoveredEmotion.emotion}</strong><br />
                    {hoveredEmotion.description}
                </div>
            )}

            {/* Spin Button */}
            <button
                onClick={handleSpin}
                disabled={spinning || showPopup}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    background: (spinning || showPopup) ? '#ccc' : '#FFD166',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (spinning || showPopup) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'Comic Neue, cursive',
                }}
            >
                {spinning ? 'Spinning...' : showPopup ? 'Close popup first!' : '🎡 Spin the Wheel!'}
            </button>

            {/* Popup Modal */}
            {showPopup && selectedEmotion && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 30,
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        fontFamily: 'Baloo, sans-serif',
                    }}>
                        <h3 style={{ color: selectedEmotion.color, marginBottom: '10px' }}>
                            {selectedEmotion.emoji} {selectedEmotion.emotion}
                        </h3>
                        <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                            {selectedEmotion.description}
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                            How are you feeling {selectedEmotion.emotion.toLowerCase()} today? Let's talk about it!
                        </p>
                        <button
                            onClick={handleChat}
                            style={{
                                padding: '10px 20px',
                                background: selectedEmotion.color,
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                marginRight: '10px',
                            }}
                        >
                            💬 Chat with Buddy
                        </button>
                        <button
                            onClick={handleClosePopup}
                            style={{
                                padding: '10px 20px',
                                background: '#ccc',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmotionExplorer;
