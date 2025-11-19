import React from 'react';

const navItems = [
    {
        title: "Healthy Habits",
        icon: "🍎🦷", // Smiling toothbrush and apple holding hands
        bgColor: "#B2DFDB", // Mint green
    },
    {
        title: "Coloring Book",
        icon: "🖍️🎨", // Crayon box with rainbow crayons and a smiling sun
        bgColor: "#FFECB3", // Sunshine yellow
    },
    {
        title: "Quiz Time",
        icon: "🏆❓", // Star badge with a question mark and confetti
        bgColor: "#BBDEFB", // Baby blue
    },
    {
        title: "Storytime",
        icon: "📖🦁", // Open book with animated characters popping out
        bgColor: "#E1BEE7", // Lavender
    },
    {
        title: "Games",
        icon: "🧩🎮", // Puzzle pieces and joystick with smiling faces
        bgColor: "#C8E6C9", // Light green
    },
    {
        title: "Emotional Wellness",
        icon: "😊😔", // Emoji-style faces
        bgColor: "#FFCCBC", // Peach
    },
];

const KiddiesCornerNavGrid = ({ onSelectTab }) => {
    return (
        <div
            className="d-grid gap-3"
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // fixed 3 columns
                gap: '1rem',
            }}
        >
            {navItems.map((item, index) => (
                <button
                    key={index}
                    onClick={() => onSelectTab(item.title)}
                    className="d-flex flex-column align-items-center justify-content-center text-center p-3 rounded-3 shadow-sm text-decoration-none text-dark border-0"
                    style={{
                        backgroundColor: item.bgColor,
                        minHeight: '120px',
                        fontFamily: 'Baloo, sans-serif',
                    }}
                >
                    <span style={{ fontSize: '2.1rem' }}>{item.icon}</span>
                    <p className="mt-2 mb-0 fw-bold">{item.title}</p>
                </button>
            ))}
        </div>
    );
};

export default KiddiesCornerNavGrid;
