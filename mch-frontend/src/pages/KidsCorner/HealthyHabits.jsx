import React from 'react';

function HealthyHabits() {
    const healthyHabits = [
        {
            id: 1,
            title: "Brush Your Teeth",
            icon: "🦷",
            description: "Brush your teeth twice a day for 2 minutes each time. Use fluoride toothpaste and don't forget to floss!",
            funFact: "Did you know? Your teeth are the only part of your body that can't repair itself!",
            color: "#004D40"
        },
        {
            id: 2,
            title: "Eat Healthy Foods",
            icon: "🍎",
            description: "Fill your plate with colorful fruits and vegetables, whole grains, and lean proteins. Drink lots of water!",
            funFact: "Fun Fact: Eating colorful foods gives your body different vitamins and makes you strong!",
            color: "#00695C"
        },
        {
            id: 3,
            title: "Wash Your Hands",
            icon: "🧼",
            description: "Wash your hands with soap and water for 20 seconds before eating and after using the bathroom.",
            funFact: "Tip: Sing 'Happy Birthday' twice while washing to make sure you wash long enough!",
            color: "#00796B"
        },
        {
            id: 4,
            title: "Stay Active",
            icon: "⚽",
            description: "Run, jump, play sports, or dance for at least 60 minutes every day. It's good for your body and mind!",
            funFact: "Exercise releases happy chemicals in your brain called endorphins!",
            color: "#00897B"
        },
        {
            id: 5,
            title: "Get Enough Sleep",
            icon: "😴",
            description: "Kids need 9-12 hours of sleep each night. A good night's sleep helps you learn and grow.",
            funFact: "While you sleep, your body repairs itself and grows stronger!",
            color: "#009688"
        },
        {
            id: 6,
            title: "Drink Water",
            icon: "💧",
            description: "Drink water throughout the day. Your body is made of mostly water and needs it to work properly!",
            funFact: "Did you know? You should drink about 6-8 glasses of water every day!",
            color: "#26A69A"
        }
    ];

    return (
        <div className="container mt-5" style={{
            background: "linear-gradient(135deg, #B2DFDB 0%, #E0F2F1 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            fontFamily: "Baloo, sans-serif"
        }}>
            <div className="text-center mb-5">
                <h2 className="fw-bold" style={{
                    fontFamily: "Comic Neue, cursive",
                    color: "#004D40",
                    textShadow: "2px 2px #B2DFDB"
                }}>
                    Healthy Habits 🏃‍♀️🍎
                </h2>
                <p style={{
                    fontSize: "1.2rem",
                    color: "#00695C",
                    maxWidth: "600px",
                    margin: "0 auto"
                }}>
                    Learn fun and easy ways to stay healthy and strong! Building good habits now will help you feel great every day! 🌟
                </p>
            </div>

            <div className="row g-4">
                {healthyHabits.map((habit) => (
                    <div key={habit.id} className="col-lg-4 col-md-6">
                        <div className="habit-card" style={{
                            background: "#fff",
                            borderRadius: "15px",
                            padding: "25px",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                            border: `3px solid ${habit.color}`,
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            cursor: "pointer",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
                        }}>
                            <div className="text-center mb-3">
                                <div style={{
                                    fontSize: "3rem",
                                    marginBottom: "10px",
                                    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))"
                                }}>
                                    {habit.icon}
                                </div>
                                <h4 style={{
                                    color: habit.color,
                                    fontFamily: "Comic Neue, cursive",
                                    fontWeight: "bold",
                                    marginBottom: "15px"
                                }}>
                                    {habit.title}
                                </h4>
                            </div>

                            <p style={{
                                color: "#424242",
                                lineHeight: "1.6",
                                flexGrow: "1",
                                marginBottom: "15px"
                            }}>
                                {habit.description}
                            </p>

                            <div style={{
                                background: "#f8f9fa",
                                borderRadius: "10px",
                                padding: "15px",
                                borderLeft: `4px solid ${habit.color}`
                            }}>
                                <p style={{
                                    color: "#616161",
                                    fontSize: "0.9rem",
                                    margin: "0",
                                    fontStyle: "italic"
                                }}>
                                    💡 {habit.funFact}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-5">
                <div style={{
                    background: "#fff",
                    borderRadius: "15px",
                    padding: "25px",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                    border: "3px solid #004D40",
                    maxWidth: "700px",
                    margin: "0 auto"
                }}>
                    <h4 style={{
                        color: "#004D40",
                        fontFamily: "Comic Neue, cursive",
                        marginBottom: "15px"
                    }}>
                        🎯 Your Daily Health Challenge!
                    </h4>
                    <p style={{
                        color: "#424242",
                        fontSize: "1.1rem",
                        lineHeight: "1.6",
                        marginBottom: "20px"
                    }}>
                        Try to practice at least 3 healthy habits today! Keep track of your progress and see how great you feel! ⭐
                    </p>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}>
                        {["🦷", "🍎", "🧼", "⚽", "😴", "💧"].map((emoji, index) => (
                            <div key={index} style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                                background: "#E0F2F1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "#B2DFDB";
                                e.currentTarget.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "#E0F2F1";
                                e.currentTarget.style.transform = "scale(1)";
                            }}>
                                {emoji}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HealthyHabits;
