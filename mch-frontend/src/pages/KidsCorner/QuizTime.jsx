import React, { useState, useEffect } from 'react';

function QuizTime() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'https://opentdb.com/api.php?amount=5&category=17&difficulty=easy&type=boolean';

    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        // Load from localStorage first
        const savedQuiz = localStorage.getItem('quizSession');
        if (savedQuiz) {
            const { savedQuestions, savedAnswers, savedScore, savedIndex, completed } = JSON.parse(savedQuiz);
            setQuestions(savedQuestions);
            setAnswers(savedAnswers);
            setScore(savedScore);
            setCurrentQuestionIndex(savedIndex);
            setQuizCompleted(completed);
            setLoading(false);
        } else if (!hasFetched) {
            // Fetch new questions only if not already fetched
            setHasFetched(true);
            fetchQuestions();
        }
    }, [hasFetched]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            if (data.response_code === 0) {
                setQuestions(data.results);
                setLoading(false);
            } else {
                setError('Failed to load questions. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            setLoading(false);
        }
    };

    const saveToLocalStorage = () => {
        const quizData = {
            savedQuestions: questions,
            savedAnswers: answers,
            savedScore: score,
            savedIndex: currentQuestionIndex,
            completed: quizCompleted,
        };
        localStorage.setItem('quizSession', JSON.stringify(quizData));
    };

    const handleAnswer = (answer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correct_answer;
        const newAnswers = [...answers, { question: currentQuestion.question, answer, correct: isCorrect }];
        setAnswers(newAnswers);
        if (isCorrect) setScore(score + 1);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setQuizCompleted(true);
        }
        saveToLocalStorage();
    };

    const resetQuiz = () => {
        localStorage.removeItem('quizSession');
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setScore(0);
        setQuizCompleted(false);
        setHasFetched(false);
        fetchQuestions();
    };

    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h2 className='fw-bold' style={{ fontFamily: "Comic Neue, cursive" }}>Quiz Time</h2>
                <p>Loading questions... 🧠</p>
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5 text-center">
                <h2 className='fw-bold' style={{ fontFamily: "Comic Neue, cursive" }}>Quiz Time</h2>
                <p className="text-danger">{error}</p>
                <button className="btn btn-primary" onClick={fetchQuestions}>Try Again</button>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <div className="container mt-5 text-center" style={{
                background: 'linear-gradient(135deg, #BBDEFB 0%, #E3F2FD 100%)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
                <h2 className='fw-bold' style={{ fontFamily: "Comic Neue, cursive", color: '#2d3436' }}>Quiz Completed! 🎉</h2>
                <p style={{ fontSize: '1.2rem', color: '#636e72' }}>Your Score: {score} / {questions.length}</p>
                <div style={{ margin: '20px 0' }}>
                    {answers.map((ans, index) => (
                        <div key={index} style={{
                            background: ans.correct ? '#d4edda' : '#f8d7da',
                            border: `2px solid ${ans.correct ? '#c3e6cb' : '#f5c6cb'}`,
                            borderRadius: '10px',
                            padding: '10px',
                            margin: '10px 0',
                            textAlign: 'left'
                        }}>
                            <strong>Q{index + 1}:</strong> {decodeHtml(ans.question)}<br />
                            <strong>Your Answer:</strong> {ans.answer} {ans.correct ? '✅' : '❌'}
                        </div>
                    ))}
                </div>
                <button className="btn btn-success me-2" onClick={resetQuiz}>Play Again 🕹️</button>
                <button className="btn btn-secondary" onClick={() => window.location.reload()}>Back to Menu</button>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="container mt-5" style={{
            background: 'linear-gradient(135deg, #BBDEFB 0%, #E3F2FD 100%)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            fontFamily: 'Baloo, sans-serif'
        }}>
            <h2 className='fw-bold text-center' style={{ fontFamily: "Comic Neue, cursive", color: '#2d3436' }}>Quiz Time 🧠❓</h2>
            <p className="text-center" style={{ color: '#636e72' }}>Test your science knowledge! Question {currentQuestionIndex + 1} of {questions.length}</p>

            <div style={{
                background: '#fff',
                borderRadius: '15px',
                padding: '20px',
                margin: '20px 0',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h4 style={{ color: '#2d3436', marginBottom: '20px' }}>{decodeHtml(currentQuestion.question)}</h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button
                        className="btn"
                        style={{
                            background: '#4CAF50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s'
                        }}
                        onClick={() => handleAnswer('True')}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        ✅ True
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: '#f44336',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '15px 30px',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            transition: 'transform 0.2s'
                        }}
                        onClick={() => handleAnswer('False')}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        ❌ False
                    </button>
                </div>
            </div>

            <div className="text-center">
                <button className="btn btn-warning" onClick={resetQuiz}>Reset Quiz 🔄</button>
            </div>
        </div>
    );
}

export default QuizTime;
