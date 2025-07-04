import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BASE_URL from '../utils/api';
import "../styles/quiz.css";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();
    const { topic } = useParams();



   useEffect(() => {
  const fetchQuestions = async () => {
    const res = await axios.get(`${BASE_URL}/api/quiz/questions?topic=${topic}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setQuestions(res.data);
    setAnswers(new Array(res.data.length).fill(null));
    localStorage.setItem('total', res.data.length);
  };
  fetchQuestions();
}, [topic]); // ✅ added topic here


    const handleSelect = (qIndex, optIndex) => {
        const newAnswers = [...answers];
        if (newAnswers[qIndex] === optIndex) {
            // If already selected, deselect it
            newAnswers[qIndex] = null;
        } else {
            // Otherwise, select the clicked option
            newAnswers[qIndex] = optIndex;
        }
        setAnswers(newAnswers);
    };


    const handleSubmit = async () => {
        if (answers.includes(null)) {
            const confirmSubmit = window.confirm(
                "Some questions are unanswered. Are you sure you want to submit?"
            );
            if (!confirmSubmit) return; // User cancelled submission
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/api/quiz/submit`,
                { answers },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            localStorage.setItem('score', res.data.score);
            navigate('/result');
        } catch (error) {
            console.error("Failed to submit quiz:", error);
            alert("Submission failed. Please try again.");
        }
    };

    return (
        <div className="page">
            <Navbar />
            <h2 className="title">Quiz Time!</h2>
            {questions.map((q, idx) => (
                <div key={idx} className="questionCard">
                    <p className="questionText">{q.question}</p>
                    <div className="optionsContainer">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`optionBtn ${answers[idx] === i ? 'selected' : ''}`}
                                onClick={() => handleSelect(idx, i)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            <button
                className="submitBtn"
                onClick={handleSubmit}
                disabled={questions.length === 0}
                title={
                    answers.includes(null)
                        ? "Some questions are unanswered"
                        : "Submit your quiz"
                }
            >
                Submit Quiz
            </button>
        </div>
    );
};

export default Quiz;
