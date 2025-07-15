import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Leaderboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizId, nickname, answers } = location.state || {};

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!quizId || !nickname || !Array.isArray(answers)) {
      navigate("/join");
      return;
    }
    const fetchQuiz = async () => {
      setLoading(true);
      setError("");
      try {
        const quizRef = doc(db, "quizzes", quizId);
        const quizSnap = await getDoc(quizRef);
        if (quizSnap.exists()) {
          const quizData = quizSnap.data();
          setQuiz(quizData);
          // Calculate score
          let correct = 0;
          quizData.questions.forEach((q, i) => {
            if (answers[i] === q.correct) correct++;
          });
          setScore(correct);
        } else {
          setError("Quiz not found.");
        }
      } catch (err) {
        setError("Error fetching quiz: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => navigate("/join"), 2000);
    }
    // eslint-disable-next-line
  }, [error]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 48 }}>Loading leaderboard...</div>;
  }
  if (error) {
    return <div style={{ textAlign: "center", marginTop: 48, color: "red" }}>{error}<br/>Redirecting...</div>;
  }
  if (!quiz) {
    return null;
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2 style={{ textAlign: "center" }}>Leaderboard</h2>
      <div style={{ margin: "2rem 0", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>{nickname}</div>
        <div style={{ margin: "1rem 0", fontSize: 18 }}>
          Score: {score} / {quiz.questions.length}
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <h3>Simple Leaderboard</h3>
        <ol>
          <li><b>{nickname}</b> — {score} pts</li>
        </ol>
        <div style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
          (Leaderboard will show all players in a real game)
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 