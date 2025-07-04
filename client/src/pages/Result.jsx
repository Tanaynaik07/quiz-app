import React,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


const Result = () => {
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedScore = localStorage.getItem("score");
    const storedTotal = localStorage.getItem("total");
    if (storedScore === null || storedTotal === null) {
      navigate("/quiz");
    } else {
      setScore(storedScore);
      setTotal(storedTotal);
    }
  }, [navigate]);

  return (
    <>
      {/* Particles */}
      <div style={styles.particle1} />
      <div style={styles.particle2} />
      <div style={styles.particle3} />

      <div style={styles.page}>
        <Navbar />
        <div style={styles.glassCard}>
          <h2 style={{ marginBottom: 20 }}>Your Score</h2>
          <p style={{ fontSize: 48, fontWeight: "bold", marginBottom: 20 }}>
            {score} / {total}
          </p>
          <button
            style={styles.button}
            onClick={() => navigate("/quiz")}
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    
    position: "relative",
    overflow: "hidden",
    color: "#fff",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.12)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: 20,
    border: "1px solid rgba(255, 255, 255, 0.18)",
    padding: 40,
    maxWidth: 400,
    width: "90%",
    textAlign: "center",
    zIndex: 2,
  },
  button: {
    backgroundColor: "#0b79d0",
    border: "none",
    padding: "12px 28px",
    color: "white",
    fontSize: 18,
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  particle1: {
    position: "fixed",
    width: 100,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: "50%",
    top: "20%",
    left: "10%",
    animation: "float 6s ease-in-out infinite",
    animationDelay: "0s",
    zIndex: 1,
  },
  particle2: {
    position: "fixed",
    width: 140,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "50%",
    top: "70%",
    left: "30%",
    animation: "float 8s ease-in-out infinite",
    animationDelay: "2s",
    zIndex: 1,
  },
  particle3: {
    position: "fixed",
    width: 60,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: "50%",
    top: "40%",
    left: "80%",
    animation: "float 7s ease-in-out infinite",
    animationDelay: "4s",
    zIndex: 1,
  },
};

// Add keyframes for animation (same as before)
const styleSheet = document.styleSheets[0];
const keyframes =
  `@keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-15px) translateX(15px); }
  }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Result;
