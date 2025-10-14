import React, { useState } from "react";
import "./BreastfeedingFAQ.css";
import Header from "./Header";

const faqs = [
    {
        question: "Is it normal for breastfeeding to hurt?",
        answer: "Breastfeeding should not be painful. Discomfort may occur in the early days, but persistent pain often signals poor latch or positioning. Seek help from a lactation consultant or La Leche League SA.",
    },
    {
        question: "Can I breastfeed if I have HIV?",
        answer: "In South Africa, HIV-positive mothers on antiretroviral therapy (ART) are encouraged to exclusively breastfeed for the first 6 months. ART significantly reduces transmission risk. Always follow your clinic’s guidance.",
    },
    {
        question: "Is formula better if I’m not producing enough milk?",
        answer: "Most mothers produce enough milk. Frequent feeding, skin-to-skin contact, and proper latch help boost supply. Formula may be necessary in some cases, but consult a health worker before deciding.",
    },
    {
        question: "Should I stop breastfeeding if I get sick?",
        answer: "Most common illnesses (like colds or flu) do not require stopping. In fact, your breastmilk contains antibodies that help protect your baby. Only stop if advised by a healthcare provider.",
    },
    {
        question: "Is it okay to breastfeed in public?",
        answer: "South African law protects your right to breastfeed anywhere. It’s natural, legal, and essential for your baby’s health. You don’t need permission.",
    },
    {
        question: "Can I drink rooibos or herbal teas while breastfeeding?",
        answer: "Rooibos is generally safe and caffeine-free. However, some herbal teas may affect milk supply or baby’s digestion. Always check with a health professional before using herbal remedies.",
    },
];

export default function BreastfeedingFAQ() {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleExpand = (index) => {
        setExpandedIndex(index === expandedIndex ? null : index);
    };

    const filteredFaqs = faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Header />
            <div className="bf-container">
                <h1 className="bf-title">
                    🍼 Breastfeeding FAQ & Myth-Busting
                </h1>
                <p className="bf-intro">
                    Tap a question to learn more. Search for topics like pain,
                    HIV, formula, or public feeding.
                </p>

                <input
                    type="text"
                    placeholder="Search a question..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bf-search"
                />

                <div className="bf-list">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className="bf-card">
                                <button
                                    className="bf-question"
                                    onClick={() => toggleExpand(index)}
                                >
                                    {faq.question}
                                    <span className="bf-toggle">
                                        {expandedIndex === index ? "▲" : "▼"}
                                    </span>
                                </button>
                                <div
                                    className={`bf-answer ${
                                        expandedIndex === index
                                            ? "expanded"
                                            : ""
                                    }`}
                                >
                                    {expandedIndex === index && (
                                        <p>{faq.answer}</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="bf-no-results">
                            No matching questions found.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
