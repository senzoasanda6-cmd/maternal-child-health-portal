import React, { useState } from "react";
import "./MentalHealth.css";
import api from "../services/api";

const resources = [
    {
        name: "South African Depression and Anxiety Group (SADAG)",
        url: "https://www.sadag.org/",
        helpline: "0800 21 22 23",
        description:
            "SADAG offers free telephonic counseling, support groups for postpartum depression and anxiety, and resources on trauma, bipolar, panic disorder, and more.",
    },
    {
        name: "Perinatal Mental Health Project (PMHP)",
        url: "https://pmhp.za.org/",
        description:
            "PMHP provides mental health care for pregnant and postnatal women in low-resource settings. They offer integrated care, training for health workers, and community outreach.",
        highlight:
            "Check out their 'Messages for Mothers' series for empowering stories and tips.",
    },
    {
        name: "Bettercare Maternal Mental Health Toolkit",
        url: "https://bettercare.co.za/maternal-mental-health/08-resources.html",
        description:
            "This toolkit includes screening tools for depression and anxiety, referral guides, info on child support grants, protection orders, and national helplines.",
    },
];

const quizQuestions = [
    {
        question: "How common is maternal mental illness in South Africa?",
        options: [
            "Less common than in high-income countries",
            "About 1 in 3 pregnant women experience it",
            "All pregnant women suffer from it",
            "It is very rare",
        ],
        answer: 1,
    },
    {
        question: "Which are common maternal mental disorders?",
        options: [
            "Depression and anxiety",
            "Schizophrenia and PTSD",
            "Bipolar and OCD",
            "TB and HIV/AIDS",
        ],
        answer: 0,
    },
];

export default function MentalHealth() {
    const [formData, setFormData] = useState({ name: "", message: "" });
    const [quizAnswers, setQuizAnswers] = useState(
        Array(quizQuestions.length).fill(null)
    );
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const handleFormChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleQuizChange = (index, value) => {
        const updated = [...quizAnswers];
        updated[index] = value;
        setQuizAnswers(updated);
    };

    const handleQuizSubmit = () => setQuizSubmitted(true);
    const handleFormSubmit = async () => {
        try {
            await api.post("/api/contact-message", formData);
            alert("Message sent successfully!");
            setFormData({ name: "", message: "" });
        } catch (err) {
            console.error("Message failed:", err);
            alert("Failed to send message.");
        }
    };

    return (
        <>
            <div className="mh-container">
                <h1 className="mh-title"> Mental Health Support for Mothers</h1>
                <p className="mh-intro">
                    These trusted resources offer compassionate support tailored
                    to maternal mental health.
                </p>

                {resources.map((res, index) => (
                    <div key={index} className="mh-card fade-in">
                        <h2 className="mh-card-title">{res.name}</h2>
                        <p className="mh-card-desc">{res.description}</p>
                        {res.highlight && (
                            <p className="mh-card-highlight">{res.highlight}</p>
                        )}
                        {res.helpline && (
                            <p className="mh-card-helpline">
                                Helpline: {res.helpline}
                            </p>
                        )}
                        <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mh-card-link"
                        >
                            Visit Website
                        </a>
                    </div>
                ))}

                <div className="mh-form fade-in">
                    <h3> Contact Us Anonymously</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name (optional)"
                        value={formData.name}
                        onChange={handleFormChange}
                    />
                    <textarea
                        name="message"
                        placeholder="Your message or question"
                        value={formData.message}
                        onChange={handleFormChange}
                    />
                    <button onClick={handleFormSubmit}>Send Message</button>
                </div>

                <div className="mh-quiz fade-in">
                    <h3> Self-Check Quiz</h3>
                    {quizQuestions.map((q, i) => (
                        <div key={i} className="mh-quiz-question">
                            <p>{q.question}</p>
                            {q.options.map((opt, j) => (
                                <label key={j}>
                                    <input
                                        type="radio"
                                        name={`q${i}`}
                                        checked={quizAnswers[i] === j}
                                        onChange={() => handleQuizChange(i, j)}
                                    />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    ))}
                    {!quizSubmitted ? (
                        <button onClick={handleQuizSubmit}>Submit Quiz</button>
                    ) : (
                        <p className="mh-quiz-result">
                            You got{" "}
                            {
                                quizAnswers.filter(
                                    (a, i) => a === quizQuestions[i].answer
                                ).length
                            }{" "}
                            out of {quizQuestions.length} correct.
                        </p>
                    )}
                </div>

                <p className="mh-footer">
                    If you're feeling overwhelmed or unsure where to turn —
                    you're not alone. Reach out. Help is available.
                </p>
            </div>
        </>
    );
}
