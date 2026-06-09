import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("AI Carbon Footprint Awareness Platform is running!");
});

app.get("/ask", async (req, res) => {
  try {
    const question = req.query.q || "How can I reduce my carbon footprint?";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an AI Carbon Footprint Awareness Assistant.

Responsibilities:
- Estimate carbon footprint
- Suggest eco-friendly alternatives
- Provide sustainability tips
- Explain environmental concepts

User Question:
${question}
`,
    });

    res.send(`
      <h2>Question:</h2>
      <p>${question}</p>

      <h2>Answer:</h2>
      <pre>${response.text}</pre>
    `);
  } catch (error) {
    res.send(`Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 