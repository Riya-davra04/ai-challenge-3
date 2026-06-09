import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const History = [
  {
    role: "user",
    parts: [
      {
        text: `You are an AI Student Study Assistant.
                Your responsibilities:
              1. Help students prepare for exams.
              2. Explain concepts step by step.
              3. Generate practice questions.
              4. Create study plans.
              5. Solve programming doubts.
              6. Suggest important topics for revision.
              7. Keep answers clear and beginner friendly.
`,
      },
    ],
  },
];

async function chatting(userProblem) {
  if (
    userProblem.toLowerCase() === "exit" ||
    userProblem.toLowerCase() === "quit"
  ) {
    console.log("Goodbye!");
    process.exit(0);
  }

  History.push({
    role: "user",
    parts: [{ text: userProblem }],
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: History,
    });

    History.push({
      role: "model",
      parts: [{ text: response.text }],
    });

    console.log("\n Study Assistant:\n");
    console.log(response.text);
    console.log("\n");
  } catch (error) {
    console.log("Error:", error.message);
  }
}

async function main() {
  console.log("====================================");
  console.log(" AI Student Study Assistant");
  console.log("Type 'exit' to quit");
  console.log("====================================");

  while (true) {
    const userProblem = readlineSync.question("\n You: ");
    await chatting(userProblem);
  }
}

main();