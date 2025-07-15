import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

const JoinQuiz = () => {
  const [gamePin, setGamePin] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Find session by gamePin
      const sessionsRef = collection(db, "sessions");
      const q = query(sessionsRef, where("gamePin", "==", gamePin.trim()));
      const sessionSnap = await getDocs(q);
      if (sessionSnap.empty) {
        setError("Invalid game PIN");
        setLoading(false);
        return;
      }
      const sessionDoc = sessionSnap.docs[0];
      const sessionId = sessionDoc.id;
      const { quizId, currentQuestionIndex } = sessionDoc.data();
      // 2. Fetch quiz
      const quizRef = doc(db, "quizzes", quizId);
      const quizSnap = await getDoc(quizRef);
      if (!quizSnap.exists()) {
        setError("Quiz not found for this session");
        setLoading(false);
        return;
      }
      const quiz = quizSnap.data();
      // 3. Add player to session's players subcollection
      const playersRef = collection(db, "sessions", sessionId, "players");
      await addDoc(playersRef, {
        nickname,
        joinedAt: serverTimestamp(),
        score: 0
      });
      // 4. Navigate to /play
      navigate("/play", {
        state: {
          quiz,
          sessionId,
          nickname,
          currentQuestionIndex: currentQuestionIndex || 0
        }
      });
    } catch (err) {
      setError("Error joining game: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>Join a Game</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", marginTop: "2rem", minWidth: 300 }}>
        <div>
          <input
            type="text"
            placeholder="Game PIN"
            value={gamePin}
            onChange={e => setGamePin(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem", width: "90%" }}
            disabled={loading}
            maxLength={6}
            pattern="[0-9]{6}"
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