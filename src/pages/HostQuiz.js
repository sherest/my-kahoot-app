import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correct: 0
});

function generateGamePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const HostQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [sessionId, setSessionId] = useState(null);
  const [gamePin, setGamePin] = useState(null);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  
  const handleQuestionChange = (idx, value) => {
    const updated = [...questions];
    updated[idx].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const handleCorrectChange = (qIdx, value) => {
    const updated = [...questions];
    updated[qIdx].correct = parseInt(value, 10);
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Quiz title is required");
      return;
    }
    for (let q of questions) {
      if (!q.question.trim() || q.options.some(opt => !opt.trim())) {
        alert("All questions and options are required");
        return;
      }
    }
    setCreating(true);
    try {
      // 1. Create quiz
      const quizDoc = await addDoc(collection(db, "quizzes"), {
        title,
        questions,
        createdAt: serverTimestamp()
      });
      setCreatedQuizId(quizDoc.id);
      // 2. Create session
      const pin = generateGamePin();
      const sessionDoc = await addDoc(collection(db, "sessions"), {
        quizId: quizDoc.id,
        createdAt: serverTimestamp(),
        status: "waiting",
        currentQuestionIndex: 0,
        gamePin: pin
      });
      setSessionId(sessionDoc.id);
      setGamePin(pin);
    } catch (err) {
      alert("Error creating quiz/session: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>Host a Quiz</h2>
      {gamePin && sessionId ? (
        <div style={{ textAlign: "center", margin: "2rem 0" }}>
          <h3>Game Session Created!</h3>
          <div style={{ fontSize: 18, margin: "1rem 0" }}>
            <b>Game PIN:</b> <span style={{ fontSize: 28, letterSpacing: 2 }}>{gamePin}</span>
          </div>
          <div style={{ color: "#888", fontSize: 14 }}>
            Session ID: {sessionId}
          </div>
          <button style={{ marginTop: 24, padding: "0.5rem 2rem" }} onClick={() => navigate("/")}>Go to Home</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label>
              <b>Quiz Title:</b>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ width: "100%", padding: 8, marginTop: 8 }}
                disabled={creating}
              />
            </label>
          </div>
          {questions.map((q, idx) => (
            <div key={idx} style={{ marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 6 }}>
              <div style={{ marginBottom: 12 }}>
                <label>
                  <b>Question {idx + 1}:</b>
                  <input
                    type="text"
                    value={q.question}
                    onChange={e => handleQuestionChange(idx, e.target.value)}
                    required
                    style={{ width: "100%", padding: 6, marginTop: 6 }}
                    disabled={creating}
                  />
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, optIdx) => (
                  <label key={optIdx}>
                    Option {optIdx + 1}:
                    <input
                      type="text"
                      value={opt}
                      onChange={e => handleOptionChange(idx, optIdx, e.target.value)}
                      required
                      style={{ width: "90%", marginLeft: 8, padding: 5 }}
                      disabled={creating}
                    />
                  </label>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <label>
                  Correct Answer:
                  <select
                    value={q.correct}
                    onChange={e => handleCorrectChange(idx, e.target.value)}
                    style={{ marginLeft: 8 }}
                    disabled={creating}
                  >
                    {q.options.map((_, i) => (
                      <option key={i} value={i}>Option {i + 1}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
          <button type="button" onClick={addQuestion} style={{ marginBottom: 24, padding: "0.5rem 1.5rem" }} disabled={creating}>
            + Add Question
          </button>
          <br />
          <button type="submit" style={{ padding: "0.75rem 2rem", fontWeight: "bold" }} disabled={creating}>
            {creating ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      )}
    </div>
  );
};

export default HostQuiz; 