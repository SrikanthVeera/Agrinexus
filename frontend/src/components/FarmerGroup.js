import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import farmerGroupImg from "../assets/farmer-group.png";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const FarmerGroup = () => {
  // AI Search State
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Group Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Socket.io: Listen for incoming messages
  useEffect(() => {
    socket.on("groupMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("groupMessage");
    };
  }, []);

  // Handle AI Search
  const handleAiSearch = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer("");
    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: aiQuestion }),
      });
      const data = await response.json();
      if (data.answer) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer("Sorry, I couldn't get an answer. Please try again.");
      }
    } catch (err) {
      setAiAnswer("Error connecting to AI service.");
    }
    setAiLoading(false);
  };

  // Handle sending group chat message
  const handleSendMessage = () => {
    if (!chatInput.trim() || !user) return;
    const msg = {
      user: user.name || "User",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("groupMessage", msg);
    setMessages((prev) => [...prev, { ...msg, self: true }]);
    setChatInput("");
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <img
        src={farmerGroupImg}
        alt="Farmer Group"
        className="w-32 h-32 mb-4 rounded-full border-4 border-green-400 shadow-md"
      />
      <h2 className="text-2xl font-bold text-green-700 mb-2">Farmer Group</h2>
      <p className="text-gray-600 text-center mb-6">
        Connect, collaborate, and grow together with your farmer community!
      </p>

      {/* AI Search Section */}
      <div className="w-full bg-green-50 rounded-lg p-4 mb-6 shadow">
        <h3 className="text-lg font-semibold text-green-700 mb-2">AI Q&A</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Ask anything about farming, crops, etc..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleAiSearch}
            disabled={aiLoading}
          >
            {aiLoading ? "Thinking..." : "Ask AI"}
          </button>
        </div>
        {aiAnswer && (
          <div className="bg-white border rounded p-3 text-gray-800 whitespace-pre-line">
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Group Chat Section */}
      <div className="w-full bg-blue-50 rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">Group Chat</h3>
        <div className="h-48 overflow-y-auto bg-white border rounded p-2 mb-2">
          {messages.length === 0 && (
            <div className="text-gray-400 text-center mt-12">No messages yet. Start the conversation!</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-1 flex ${msg.self ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-3 py-1 rounded-lg max-w-xs break-words ${
                  msg.self
                    ? "bg-green-200 text-green-900"
                    : "bg-blue-200 text-blue-900"
                }`}
              >
                <span className="font-semibold mr-2">{msg.user}</span>
                <span>{msg.text}</span>
                <span className="block text-xs text-gray-500 text-right">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {user ? (
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type your message..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        ) : (
          <div className="text-red-500 text-sm mt-2">Please log in to participate in the group chat.</div>
        )}
      </div>
    </motion.div>
  );
};

export default FarmerGroup; 