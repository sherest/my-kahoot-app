import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Welcome to Kahoot Clone</h1>
      <button onClick={() => navigate("/host")} style={{ margin: "1rem", padding: "1rem 2rem" }}>Host Quiz</button>
      <button onClick={() => navigate("/join")} style={{ margin: "1rem", padding: "1rem 2rem" }}>Join Quiz</button>
    </div>
  );
};

export default Home; 