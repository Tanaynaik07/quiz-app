import React,{ useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/quizmenu.css';
import BASE_URL from '../utils/api'; 

const QuizMenu = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/quiz/topics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTopics(res.data); // Assuming res.data is an array of { name: 'java', questionCount: 10 }
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        alert("Unable to load quiz topics");
      }
    };

    fetchTopics();
  }, []);

  const handleStart = (topic) => {
    navigate(`/quiz/${topic}`);
  };

  return (
    <div className="quizMenuContainer">
      <h2 className="quizMenuTitle">Select a Quiz</h2>
      {topics.length === 0 ? (
        <p>Loading topics...</p>
      ) : (
        topics.map((t) => (
          <button
            key={t._id}
            className="quizMenuButton"
            onClick={() => handleStart(t.name)}
          >
            {t.name.charAt(0).toUpperCase() + t.name.slice(1)} Quiz ({t.questionCount})
          </button>
        ))
      )}
    </div>
  );
};

export default QuizMenu;
