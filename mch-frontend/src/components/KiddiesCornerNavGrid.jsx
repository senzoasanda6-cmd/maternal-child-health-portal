import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
    {
        title: "Healthy Habits",
        icon: "🍎🦷", // Smiling toothbrush and apple holding hands
        bgColor: "#B2DFDB", // Mint green
        navigateTo: "#",
    },
    {
        title: "Coloring Book",
        icon: "🖍️🎨", // Crayon box with rainbow crayons and a smiling sun
        bgColor: "#FFECB3", // Sunshine yellow
        navigateTo: "#",
    },
    {
        title: "Quiz Time",
        icon: "🏆❓", // Star badge with a question mark and confetti
        bgColor: "#BBDEFB", // Baby blue
        navigateTo: "#",
    },
    {
        title: "Storytime",
        icon: "📖🦁", // Open book with animated characters popping out
        bgColor: "#E1BEE7", // Lavender
        navigateTo: "#",
    },
    {
        title: "Games",
        icon: "🧩🎮", // Puzzle pieces and joystick with smiling faces
        bgColor: "#C8E6C9", // Light green
        navigateTo: "#",
    },
    {
        title: "Mood Meter",
        icon: "😊😔", // Emoji-style faces
        bgColor: "#FFCCBC", // Peach
        navigateTo: "#",
    },
];

const KiddiesCornerNavGrid = () => {
    return (
        <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.navigateTo}
                    className="d-flex flex-column align-items-center justify-content-center p-3 rounded-3 shadow-sm text-decoration-none text-dark"
                    style={{
                        backgroundColor: item.bgColor,
                        minHeight: '120px',
                        fontFamily: 'Baloo, sans-serif', // Simple sans-serif for body text
                    }}
                >
                    <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                    <p className="mt-2 mb-0 fw-bold">{item.title}</p>
                </Link>
            ))}
        </div>
    );
};

export default KiddiesCornerNavGrid;
