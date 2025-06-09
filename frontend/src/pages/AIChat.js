import React, { useEffect } from "react";

const AGENT_ID = "d6e5e5b2-7b6e-4e2e-8e7e-2e6e5e5b2b6e"; // Replace with your Dialogflow agent ID if needed

const AIChat = () => {
  useEffect(() => {
    // Dynamically add Dialogflow Messenger script if not already present
    if (!document.getElementById("df-messenger-script")) {
      const script = document.createElement("script");
      script.id = "df-messenger-script";
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h2 style={{ marginBottom: 24, fontWeight: 700, fontSize: 28 }}>Agri AI Chatbot</h2>
      {/* Dialogflow Messenger Widget */}
      <df-messenger
        intent="WELCOME"
        chat-title="Agri AI"
        agent-id={AGENT_ID}
        language-code="en"
      ></df-messenger>
    </div>
  );
};

export default AIChat;
