import React, { useState } from "react";

const JoinQuiz = () => {
  const [pin, setPin] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle join logic here
    alert(`Joining game with PIN: ${pin} and Nickname: ${nickname}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2>Join a Quiz</h2>
      <form onSubmit={handleSubmit} style={{ display: "inline-block", marginTop: "2rem" }}>
        <div>
          <input
            type="text"
            placeholder="Game PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem" }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            style={{ padding: "0.5rem", margin: "0.5rem" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 2rem", marginTop: "1rem" }}>Join</button>
      </form>
    </div>
  );
};

export default JoinQuiz; 