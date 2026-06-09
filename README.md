# 🌱 AI Carbon Footprint Awareness Platform

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
* ⚡ Fast response with caching
* 🔁 Retry mechanism for API reliability

---

## 🧠 Approach & Logic

The system uses Google's Gemini AI model to:

1. Analyze user input (daily habits, travel, energy usage)
2. Estimate carbon emissions using logical assumptions
3. Generate structured responses:

   * Carbon footprint calculation
   * Eco-friendly alternatives
   * Sustainability tips
   * Environmental explanations

---

## ⚙️ Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* AI Model: Google Gemini (`gemini-3-flash-preview`)
* Deployment: Render

---

## 🛠️ How It Works

1. User enters a question in the chat interface
2. Request is sent to backend (`/ask` API)
3. Backend processes input with validation and caching
4. Gemini AI generates response
5. Response is displayed in chat UI

---

## 📌 Assumptions

* Average fuel efficiency and emission values are used
* AI responses are approximate and may vary
* Internet connection is required

---

## 🔒 Security

* API key stored securely in `.env`
* Input validation implemented
* Security headers added to prevent attacks

---

## ⚡ Efficiency

* Response caching implemented (improves speed)
* Cache size controlled to avoid memory issues
* Lightweight frontend for faster load

---

## 🧪 Testing

Run the following command:

npm test

This will:

* Check server health endpoint (`/health`)
* Test AI response generation (`/ask`)

---

## ♿ Accessibility

* Responsive design (mobile-friendly)
* ARIA labels for better usability
* Keyboard support (Enter key)
* Readable fonts and proper contrast

---

## 🔗 Links

* GitHub Repo: https://github.com/Riya-davra04/ai-challenge-3
* Live Demo: https://ai-challenge-3-1.onrender.com

---

## 🙌 Conclusion

This project demonstrates a practical AI solution for raising awareness about carbon footprint and promoting sustainable lifestyle choices using modern web technologies and AI.

---

## 🚀 Future Improvements

* Voice input support 🎤
* Multi-language support 🌍
* User history tracking 📊
