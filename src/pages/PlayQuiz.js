import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PlayQuiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, quizId, nickname } = location.state || {};

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (!quiz || !quizId || !nickname) {
      navigate("/join");
    }
    // eslint-disable-next-line
  }, []);

  if (!quiz || !quizId || !nickname) {
    return null;
  }

  const questions = quiz.questions || [];
  const q = questions[current];

  const handleSelect = (idx) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/leaderboard", {
        state: {
          quizId,
          nickname,
          answers
        }
      });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>{quiz.title}</h2>
      <div style={{ margin: "2rem 0" }}>
        <h3>Question {current + 1} of {questions.length}</h3>
        <div style={{ fontWeight: "bold", marginBottom: 16 }}>{q.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: 6,
                border: answers[current] === idx ? "2px solid #1976d2" : "1px solid #ccc",
                background: answers[current] === idx ? "#e3f0ff" : "#fff",
                fontWeight: answers[current] === idx ? "bold" : "normal",
                cursor: "pointer"
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        disabled={typeof answers[current] !== "number"}
        style={{ padding: "0.75rem 2rem", fontWeight: "bold", marginTop: 24 }}
      >
        {current < questions.length - 1 ? "Next" : "Finish"}
      </button>
    </div>
  );
};

export default PlayQuiz; 