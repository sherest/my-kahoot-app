import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correct: 0
});

const HostQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
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
    // Validate
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
    // Save to Firestore
    try {
      const docRef = await addDoc(collection(db, "quizzes"), {
        title,
        questions,
        createdAt: serverTimestamp()
      });
      alert(`Quiz created! ID: ${docRef.id}`);
      navigate("/");
    } catch (err) {
      alert("Error creating quiz: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>Host a Quiz</h2>
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
                >
                  {q.options.map((_, i) => (
                    <option key={i} value={i}>Option {i + 1}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion} style={{ marginBottom: 24, padding: "0.5rem 1.5rem" }}>
          + Add Question
        </button>
        <br />
        <button type="submit" style={{ padding: "0.75rem 2rem", fontWeight: "bold" }}>Create Quiz</button>
      </form>
    </div>
  );
};

export default HostQuiz; 