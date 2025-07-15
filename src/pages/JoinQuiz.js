import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const JoinQuiz = () => {
  const [quizId, setQuizId] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const quizRef = doc(db, "quizzes", quizId.trim());
      const quizSnap = await getDoc(quizRef);
      if (quizSnap.exists()) {
        const quizData = quizSnap.data();
        navigate("/play", {
          state: {
            quiz: quizData,
            quizId: quizId.trim(),
            nickname
          }
        });
      } else {
        setError("Quiz not found. Please check the Quiz ID.");
      }
    } catch (err) {
      setError("Error fetching quiz: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>Join a Quiz</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", marginTop: "2rem", minWidth: 300 }}>
        <div>
          <input
            type="text"
            placeholder="Quiz ID"
            value={quizId}
            onChange={e => setQuizId(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "90%" }}
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "90%" }}
            disabled={loading}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 2rem", marginTop: "1rem" }} disabled={loading}>
          {loading ? "Joining..." : "Join"}
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
};

export default JoinQuiz; 