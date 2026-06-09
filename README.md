# AI Carbon Footprint Awareness Platform

## 📌 Project Overview

This project is an AI-powered Carbon Footprint Awareness Assistant that helps users understand the environmental impact of their daily activities and suggests eco-friendly alternatives.

---

## 🎯 Chosen Vertical

Sustainability & Environment Awareness

---

## 🚀 Features

* 💬 Chat-based AI assistant (ChatGPT-like UI)
* 📊 Estimates carbon footprint based on user input
* 🌱 Suggests eco-friendly alternatives
* 💡 Provides sustainability tips
* 📖 Explains environmental concepts in simple language
* 🌙 Dark/Light mode toggle
* 📋 Copy response feature

---

## 🧠 Approach & Logic

The system uses Google's Gemini AI model to:

1. Analyze user input (daily habits, travel, energy usage)
2. Estimate carbon emissions using logical assumptions
3. Generate structured responses:

   * Carbon footprint calculation
   * Alternatives
   * Tips
   * Explanations

---

## ⚙️ Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* AI Model: Google Gemini (gemini-3-flash-preview)
* Deployment: Render

---

## 🛠️ How It Works

1. User enters a question in the chat interface
2. Request is sent to backend (`/ask` API)
3. Backend calls Gemini AI
4. AI generates response
5. Response is displayed in chat UI

---

## 📌 Assumptions

* Average fuel efficiency and emission values are used
* Responses are AI-generated and may vary
* Internet connection is required

---

## 🔒 Security Considerations

* API key stored in `.env`
* No sensitive user data stored

---

## ⚡ Efficiency

* Lightweight frontend
* Fast API responses using Gemini Flash model
* Retry logic for API failures

---

## 🧪 Testing

* Tested with multiple user queries
* Handled edge cases (empty input, API errors)

---

## ♿ Accessibility

* Simple and clean UI
* Readable fonts
* Easy interaction (keyboard + click)

---

## 🔗 Links

* GitHub Repo: https://github.com/Riya-davra04/ai-challenge-3
* Live Demo: https://ai-challenge-3-1.onrender.com

---

## 🙌 Conclusion

This project demonstrates a practical AI solution for raising awareness about carbon footprint and encouraging sustainable lifestyle choices.
