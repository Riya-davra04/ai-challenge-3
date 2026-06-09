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
        text: `You are an AI Carbon Footprint Awareness Assistant.

Your responsibilities:
1. Help users understand their carbon footprint.
2. Estimate carbon emissions from daily activities.
3. Suggest eco-friendly alternatives.
4. Provide sustainability tips.
5. Recommend ways to reduce energy consumption.
6. Explain climate change and environmental concepts.
7. Keep answers simple, practical, and beginner-friendly.
8. Encourage sustainable lifestyle choices.
9. Suggest greener transportation options.
10. Help users track and reduce environmental impact.`,
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
  console.log(" AI Carbon Footprint Awareness Platform");
  console.log("Type 'exit' to quit");
  console.log("====================================");

  while (true) {
    const userProblem = readlineSync.question("\n You: ");
    await chatting(userProblem);
  }
}

main();