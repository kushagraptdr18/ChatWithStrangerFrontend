import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const Chat = ({ userName }) => {
  const socket = useMemo(() => io("https://chatwithstrangerbackend.onrender.com"), []);

  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(true); // true = no user present
  const [opponent, setOpponent] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected,", socket.id);
    });

    socket.emit("username", userName);

    socket.on("roomConnected", ({ room, users }) => {
      setRoom(room);
      const opponentUser = users.find((user) => user !== userName);
      setOpponent(opponentUser);
      setStatus(false); // Switch to chat mode
      console.log(`Connected to room ${room} with users ${users}`);
    });

    socket.on("noUserOnline", (msg) => {
      setStatus(msg ? true : false);
    });

    socket.on("receiveMessage", (data) => {
      if (data.sender !== socket.id) {
        setMessages((prev) => [
          ...prev,
          { sender: data.sender, name: data.username, text: data.message },
        ]);
      }
    });

    // Handle opponent disconnection
    socket.on("opponentDisconnected", () => {
      setRoom(null);
      setOpponent(null);
      setStatus(true);
      setMessages([]);
      alert("Your opponent has disconnected. Waiting for a new user...");
    });

    // Handle room disconnection after a skip
    socket.on("roomDisconnected", () => {
      setRoom(null);
      setOpponent(null);
      setMessages([]);
      setStatus(true);
      alert("You were skipped and placed back in the queue. Waiting for a new match...");
    });
  }, [socket, userName]);

  const handleSend = () => {
    if (message.trim() && room) {
      socket.emit("sendMessage", { room, message });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", name: userName, text: message },
      ]);
      setMessage("");
    }
  };

  const handleSkip = () => {
    socket.emit("skip");
    setRoom(null);
    setOpponent(null);
    setMessages([]);
    setStatus(true);
    alert("You have skipped the current chat. Waiting for a new user...");
  };

  const handlePhoneCall = () => {
    alert("Feature is coming soon");
  };

  const handleVideoCall = () => {
    alert("Feature is coming soon");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {status ? (
        // Display when no user is online
        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
          <h1 className="text-3xl font-semibold mb-4 text-blue-600">Welcome, {userName}!</h1>
          <p className="text-gray-600 text-lg">
            No user is available at the moment. Please wait for someone to connect...
          </p>
        </div>
      ) : (
        // Chat interface
        <>
          <div className="bg-blue-500 text-white p-4 flex flex-col md:flex-row justify-between items-center">
  <div className="mb-2 md:mb-0">
    <h1 className="text-xl font-bold">Welcome, {userName}!</h1>
  </div>
  <div className="flex flex-wrap gap-3 items-center">
    <button
      onClick={handlePhoneCall}
      className="bg-green-500 text-sm px-4 py-2 rounded hover:bg-green-600 transition"
    >
      <span className="md:hidden">📞</span> {/* Display only symbol on small screens */}
      <span className="hidden md:inline">Phone Call</span> {/* Display text only on medium screens and above */}
    </button>
    <button
      onClick={handleVideoCall}
      className="bg-red-500 text-sm px-4 py-2 rounded hover:bg-red-600 transition"
    >
      <span className="md:hidden">📹</span> {/* Display only symbol on small screens */}
      <span className="hidden md:inline">Video Call</span> {/* Display text only on medium screens and above */}
    </button>
    <button
      onClick={handleSkip}
      className="bg-gray-700 text-sm px-4 py-2 rounded text-white hover:bg-gray-800 transition"
    >
      <span className="md:hidden">⏭️</span> {/* Display only symbol on small screens */}
      <span className="hidden md:inline">Skip</span> {/* Display text only on medium screens and above */}
    </button>
    <p className="text-sm">Chatting with: <span className="text-yellow-300">{opponent || "Unknown User"}</span></p>
  </div>
</div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg max-w-sm shadow-md ${
                  msg.sender === "You"
                    ? "bg-blue-100 ml-auto text-right"
                    : "bg-gray-200 mr-auto text-left"
                }`}
              >
                <strong className="block text-gray-800 mb-1">{msg.name}:</strong>
                <span className="text-gray-700 text-sm">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="p-4 flex items-center gap-2 bg-white shadow-md">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
