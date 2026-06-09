// import express from "express";
// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();

// //Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// //Home page
// app.get("/", (req, res) => {
//   res.sendFile(process.cwd() + "/index.html");
// });

// //Ask route
// app.post("/ask", async (req, res) => {
//   try {
//     const question = req.body.q;

//     if (!question) {
//       return res.send("Please enter a question");
//     }

//     let response;

//     for (let i = 0; i < 3; i++) {
//       try {
//         response = await ai.models.generateContent({
//           model: "gemini-3-flash-preview", // ✅ YOUR MODEL
//           contents: `
// You are an AI Carbon Footprint Awareness Assistant.

// Responsibilities:
// - Estimate carbon footprint
// - Suggest eco-friendly alternatives
// - Provide sustainability tips
// - Explain environmental concepts

// User Question:
// ${question}
// `,
//         });
//         break;
//       } catch (err) {
//         if (i === 2) throw err;
//         await new Promise(r => setTimeout(r, 2000));
//       }
//     }

//     res.send(`
//       <h2>Question:</h2>
//       <p>${question}</p>

//       <h2>Answer:</h2>
//       <pre>${response.text}</pre>

//       <br><br>
//       <a href="/">Ask another question</a>
//     `);

//   } catch (error) {
//     console.error(error);

//     res.send(`
//       <h3>Server Busy / Error</h3>
//       <p>Please try again after few seconds.</p>
//       <pre>${error.message}</pre>
//       <a href="/">Go Back</a>
//     `);
//   }
// });

// //Server start
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(" Server running on port " + PORT);
// });

import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Cache (Efficiency)
const cache = new Map();

// Home route
app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/index.html");
});

// Ask route
app.post("/ask", async (req, res) => {
  try {
    const question = req.body.q;

    // Validation (Security + Quality)
    if (!question || typeof question !== "string") {
      return res.status(400).send("Invalid input");
    }

    if (question.length > 200) {
      return res.status(400).send("Question too long");
    }

    // Cache check
    if (cache.has(question)) {
      return res.send(cache.get(question));
    }

    let response;

    for (let i = 0; i < 3; i++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `
You are an AI Carbon Footprint Awareness Assistant.

Give structured answer:
1. Carbon footprint calculation
2. Eco-friendly alternatives
3. Sustainability tips
4. Explanation

User Question:
${question}
`,
        });
        break;
      } catch (err) {
        if (i === 2) throw err;
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    const output = response.text;

    cache.set(question, output);
    if (cache.size > 50) {
      cache.clear();
    }

    res.send(output);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Busy. Try again.");
  }
});

// Health check (Testing + DevOps)
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});