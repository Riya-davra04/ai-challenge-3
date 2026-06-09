import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//Home page
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

//Ask route
app.post("/ask", async (req, res) => {
  try {
    const question = req.body.q;

    if (!question) {
      return res.send("Please enter a question");
    }

    let response;

    for (let i = 0; i < 3; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3-flash-preview", // ✅ YOUR MODEL
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
        break;
      } catch (err) {
        if (i === 2) throw err;
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    res.send(`
      <h2>Question:</h2>
      <p>${question}</p>

      <h2>Answer:</h2>
      <pre>${response.text}</pre>

      <br><br>
      <a href="/">Ask another question</a>
    `);

  } catch (error) {
    console.error(error);

    res.send(`
      <h3>Server Busy / Error</h3>
      <p>Please try again after few seconds.</p>
      <pre>${error.message}</pre>
      <a href="/">Go Back</a>
    `);
  }
});

//Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(" Server running on port " + PORT);
});