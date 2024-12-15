// Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setUserName }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      setUserName(name);
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Chat App</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="p-3 border rounded w-80 mb-4"
      />
      <button
        onClick={handleStart}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Start
      </button>
    </div>
  );
};

export default Home;
