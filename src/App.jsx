import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Chat from "./Components/Chat";

const App = () => {
  const [userName, setUserName] = useState("");

  return (
    
      <Routes>
        <Route path="/" element={<Home setUserName={setUserName} />} />
        <Route path="/chat" element={<Chat userName={userName} />} />
      </Routes>
    
  );
};

export default App;
