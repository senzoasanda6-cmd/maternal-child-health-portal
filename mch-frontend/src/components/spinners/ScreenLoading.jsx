import React from "react";
import logo from "../../assets/logos/mch_ai_v1_logo_transp.png";

const ScreenLoading = ({ message = "Loading...", size = 96 }) => {
    const diameter = size;
    const stroke = Math.max(4, Math.round(size * 0.08));
    const radius = (diameter - stroke) / 2;
    const viewBox = `0 0 ${diameter} ${diameter}`;
    const logoWidth = Math.min(260, Math.round(size * 2.25));

    return (
        <div
            role="status"
            aria-live="polite"
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff36",
                zIndex: 9999,
                padding: 24,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    color: "var(--text, #111827)",
                }}
            >
                <img
                    src={logo}
                    alt="MCH AI"
                    className="mb-4 shadowz"
                    style={{
                        width: logoWidth,
                        height: "auto",
                        borderRadius: 16,
                        // boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
                        objectFit: "contain",
                        background: "transparent",
                    }}
                />

                <svg
                    width={diameter}
                    height={diameter}
                    viewBox={viewBox}
                    aria-hidden="true"
                    style={{ display: "block" }}
                >
                    <defs>
                        <linearGradient id="sg" x1="0%" x2="100%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--secondary, #ff9800)" />
                            <stop offset="60%" stopColor="var(--primary, #1d4189)" />
                        </linearGradient>
                        <filter id="f1" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.08" />
                        </filter>
                    </defs>

                    {/* background band uses --accent */}
                    <circle
                        cx={diameter / 2}
                        cy={diameter / 2}
                        r={radius}
                        stroke="var(--accent, #eef2ff)"
                        strokeWidth={stroke}
                        fill="none"
                        opacity={1}
                    />

                    {/* animated arc */}
                    <g filter="url(#f1)">
                        <circle
                            cx={diameter / 2}
                            cy={diameter / 2}
                            r={radius}
                            stroke="url(#sg)"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={`${Math.PI * 2 * radius * 0.72} ${Math.PI * 2 * radius}`}
                            transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
                            fill="none"
                            style={{
                                transformOrigin: "center",
                                animation: "spin 1.2s linear infinite",
                            }}
                        />
                    </g>

                    <style>{`
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    `}</style>
                </svg>

                <div style={{ textAlign: "center", maxWidth: 360 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text, #111827)" }}>{message}</div>
                    <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6, color: "var(--muted, #475569)" }}>Please wait a moment</div>
                </div>
            </div>
        </div>
    );
};

export default ScreenLoading;
