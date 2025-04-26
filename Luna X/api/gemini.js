// /api/gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { prompt } = req.body;
    
    const result = await model.generateContent(prompt);
    res.status(200).json({ response: result.response.text() });
  } catch (error) {
    res.status(500).json({ error: "API Error" });
  }
};