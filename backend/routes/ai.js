const express = require("express");
const router = express.Router();
require("dotenv").config();
const { generateMockResponse } = require("../utils/mockAiService");

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
let openai = null;
let usingMockService = false;

// Only initialize OpenAI if API key is available and valid
if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your_openai_api_key_here') {
  try {
    const OpenAI = require("openai");
    openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    console.log("OpenAI client initialized successfully");
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error.message);
    usingMockService = true;
  }
} else {
  console.warn("OpenAI API key not found or not set. Using mock AI service instead.");
  usingMockService = true;
}

router.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }
  
  // Use mock service if OpenAI is not available
  if (!openai || usingMockService) {
    console.log("Using mock AI service for question:", question);
    const mockAnswer = generateMockResponse(question);
    return res.json({ 
      answer: mockAnswer,
      mockResponse: true,
      message: "Using mock AI service. Set OPENAI_API_KEY in .env for real responses."
    });
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an expert in agriculture and farming. Answer user questions in simple, practical terms." },
        { role: "user", content: question },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    const answer = completion.choices[0].message.content.trim();
    res.json({ answer });
  } catch (err) {
    console.error("OpenAI API error:", err.response?.data || err.message || err);
    res.status(500).json({ 
      error: "Failed to get AI answer", 
      details: err.message,
      mockResponse: true,
      answer: "Sorry, I couldn't process your question at this time. This is a fallback response."
    });
  }
});

module.exports = router; 